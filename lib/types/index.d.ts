/**
 * Semantic session titles for DeepSeek Harness.
 *
 * This plugin intentionally reuses DSH's durable session-title service and
 * auxiliary LLM helper. It replaces only the bundled provider policy.
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type SessionTitleUserMessage } from '@deepseek-ai/dsh-session-title';
import { resolveSessionTitleLlmConfig } from '@deepseek-ai/dsh-session-title-llm';
export declare const name = "dsh-auto-chat-titles";
export declare const inject: string[];
export declare const SETTINGS_NAMESPACE: import("@deepseek-ai/dsh-settings").SettingsNamespace;
export declare const REGENERATE_COMMAND = "regenerate-title";
export type RouteMode = 'conversation' | 'fixed';
export interface Config {
    routeMode: RouteMode;
    provider?: string;
    model?: string;
    targetWords: number;
    targetCjkCharacters: number;
    maxInputBytes: number;
    maxOutputTokens: number;
    timeoutMs: number;
    maxMessages: number;
}
export declare const Config: z<Config>;
/** Validate constraints Schemastery cannot express across fields. */
export declare function validateSettings(value: Config): void;
/** Select the most recent human-message window used by manual regeneration. */
export declare function selectTitleMessages(messages: readonly SessionTitleUserMessage[], maxMessages: number): readonly SessionTitleUserMessage[];
/** Convert live plugin settings into DSH's validated LLM title policy. */
export declare function resolveTitlePolicy(value: Config): ReturnType<typeof resolveSessionTitleLlmConfig>;
/** Install the provider, live settings namespace, and regeneration command. */
export declare function apply(ctx: Context, config: Config): void;
