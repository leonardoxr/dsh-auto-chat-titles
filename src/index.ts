/**
 * Semantic session titles for DeepSeek Harness.
 *
 * This plugin intentionally reuses DSH's durable session-title service and
 * auxiliary LLM helper. It replaces only the bundled provider policy.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { CommandInvocation } from '@deepseek-ai/dsh-commands'
import z from '@deepseek-ai/schemastery'
import { SessionTitleProviderId, type SessionTitleUserMessage } from '@deepseek-ai/dsh-session-title'
import {
  generateSessionTitleWithLlm,
  resolveSessionTitleLlmConfig,
  type SessionTitleLlmConfig,
} from '@deepseek-ai/dsh-session-title-llm'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'

export const name = 'dsh-auto-chat-titles'
export const inject = ['sessionTitle', 'llm', 'sessions', 'commands', 'settings']
export const SETTINGS_NAMESPACE = settingsNamespace('auto-chat-titles')
export const REGENERATE_COMMAND = 'regenerate-title'

export type RouteMode = 'conversation' | 'fixed'

export interface Config {
  routeMode: RouteMode
  provider?: string
  model?: string
  targetWords: number
  targetCjkCharacters: number
  maxInputBytes: number
  maxOutputTokens: number
  timeoutMs: number
  maxMessages: number
}

export const Config: z<Config> = z.object({
  routeMode: z.union(['conversation', 'fixed']).default('conversation'),
  provider: z.string(),
  model: z.string(),
  targetWords: z.number().step(1).min(1).max(20).default(5),
  targetCjkCharacters: z.number().step(1).min(1).max(40).default(10),
  maxInputBytes: z.number().step(1).min(256).max(65536).default(8192),
  maxOutputTokens: z.number().step(1).min(8).max(256).default(64),
  timeoutMs: z.number().step(1).min(1000).max(300000).default(60000),
  maxMessages: z.number().step(1).min(1).max(100).default(12),
})

/** Validate constraints Schemastery cannot express across fields. */
export function validateSettings(value: Config): void {
  if (value.routeMode !== 'fixed') return
  if (value.provider?.trim() === '' || value.provider === undefined) {
    throw new Error('A provider is required when title route mode is fixed')
  }
  if (value.model?.trim() === '' || value.model === undefined) {
    throw new Error('A model is required when title route mode is fixed')
  }
}

/** Select the most recent human-message window used by manual regeneration. */
export function selectTitleMessages(
  messages: readonly SessionTitleUserMessage[],
  maxMessages: number,
): readonly SessionTitleUserMessage[] {
  if (!Number.isSafeInteger(maxMessages) || maxMessages < 1) {
    throw new Error('maxMessages must be a positive integer')
  }
  return messages.slice(-maxMessages)
}

/** Convert live plugin settings into DSH's validated LLM title policy. */
export function resolveTitlePolicy(value: Config): ReturnType<typeof resolveSessionTitleLlmConfig> {
  validateSettings(value)
  const policy: SessionTitleLlmConfig = {
    targetWords: value.targetWords,
    targetCjkCharacters: value.targetCjkCharacters,
    maxInputBytes: value.maxInputBytes,
    maxOutputTokens: value.maxOutputTokens,
    timeoutMs: value.timeoutMs,
    ...(value.routeMode === 'fixed'
      ? { provider: value.provider!.trim(), model: value.model!.trim() }
      : {}),
  }
  return resolveSessionTitleLlmConfig(policy)
}

/** Install the provider, live settings namespace, and regeneration command. */
export function apply(ctx: Context, config: Config): void {
  validateSettings(config)

  const settings = ctx.settings.register(SETTINGS_NAMESPACE, Config, {
    base: config,
    validate: validateSettings,
  })
  const source = () => settings.get()

  const providerId = SessionTitleProviderId(name)
  ctx.sessionTitle.register({
    id: providerId,
    automatic: 'first-prompt',
    async generate(request) {
      const current = source()
      const selected = selectTitleMessages(request.messages, current.maxMessages)
      return generateSessionTitleWithLlm(
        ctx,
        resolveTitlePolicy(current),
        request,
        selected,
        providerId,
      )
    },
  })

  ctx.commands.register({
    name: REGENERATE_COMMAND,
    description: 'Regenerate this session title from the current conversation',
    recordInput: false,
    async handler(invocation) {
      try {
        await ctx.sessionTitle.refresh(invocation.agent.session, invocation.signal)
        const snapshot = ctx.sessionTitle.get(invocation.agent.session)
        return {
          kind: 'success',
          text: snapshot === undefined ? 'Title regeneration completed.' : `Title regenerated: ${snapshot.title}`,
          ...(snapshot === undefined ? {} : { sourceEventSeq: snapshot.eventSeq }),
        }
      } catch (error) {
        return {
          kind: 'error',
          text: error instanceof Error ? error.message : String(error),
        }
      }
    },
  })
}
