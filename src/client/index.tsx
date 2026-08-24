import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { ModelProviderGroup, SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { STYLE_ID, styles } from './styles.ts'

const PLUGIN_ID = 'dsh-auto-chat-titles'
const NS = 'auto-chat-titles'

interface TitleSettings {
  routeMode: 'conversation' | 'fixed'
  provider?: string
  model?: string
  targetWords: number
  targetCjkCharacters: number
  maxInputBytes: number
  maxOutputTokens: number
  timeoutMs: number
  maxMessages: number
}

interface RegenerateActionProps {
  sessionId: SessionId
  regenerate(sessionId: SessionId): Promise<void>
}

interface SettingsCardProps {
  settings: SettingsScope<TitleSettings>
  loadModels(): Promise<{ groups: ModelProviderGroup[]; failures: string[] }>
}

export const inject = ['slots', 'sessions', 'connection', 'settingsScope']

function decodeSettings(value: unknown): TitleSettings | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const item = value as Partial<TitleSettings>
  if (item.routeMode !== 'conversation' && item.routeMode !== 'fixed') return undefined
  const numbers = [
    item.targetWords,
    item.targetCjkCharacters,
    item.maxInputBytes,
    item.maxOutputTokens,
    item.timeoutMs,
    item.maxMessages,
  ]
  if (numbers.some(number => typeof number !== 'number' || !Number.isFinite(number))) return undefined
  return item as TitleSettings
}

function installStyles(): () => void {
  const old = document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)
  old?.remove()
  const tag = document.createElement('style')
  tag.dataset.plugin = PLUGIN_ID
  tag.dataset.pluginCss = STYLE_ID
  tag.textContent = styles
  document.head.appendChild(tag)
  return () => tag.remove()
}

function RegenerateAction({ sessionId, regenerate }: RegenerateActionProps): ReactNode {
  const [busy, setBusy] = useState(false)
  const [label, setLabel] = useState('Regenerate title')

  async function run() {
    if (busy) return
    setBusy(true)
    setLabel('Regenerating…')
    try {
      await regenerate(sessionId)
      setLabel('Request submitted — check activity')
      window.setTimeout(() => setLabel('Regenerate title'), 1800)
    } catch (error) {
      setLabel(error instanceof Error ? error.message : 'Regeneration failed')
      window.setTimeout(() => setLabel('Regenerate title'), 3500)
    } finally {
      setBusy(false)
    }
  }

  return <button type="button" className="dact-action" disabled={busy} aria-busy={busy} title={label} onClick={run}>
    {busy ? <span className="dact-spin" aria-hidden="true" /> : <span aria-hidden="true">↻</span>}
    <span>{label}</span>
  </button>
}

function SettingsCard({ settings, loadModels }: SettingsCardProps): ReactNode {
  const snapshot = useSyncExternalStore(
    listener => settings.subscribe(listener),
    () => settings.getSnapshot(),
    () => settings.getSnapshot(),
  )
  const current = snapshot.value
  const [groups, setGroups] = useState<ModelProviderGroup[]>([])
  const [catalogFailures, setCatalogFailures] = useState<string[]>([])
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'success' | 'error'; text: string }>({ kind: 'idle', text: '' })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let active = true
    loadModels().then(result => {
      if (!active) return
      setGroups(result.groups)
      setCatalogFailures(result.failures)
    }).catch(error => {
      if (!active) return
      setCatalogFailures([error instanceof Error ? error.message : String(error)])
    })
    return () => { active = false }
  }, [loadModels])

  const routeValue = current?.routeMode === 'fixed' && current.provider && current.model
    ? `${current.provider}\u0000${current.model}`
    : 'conversation'
  const knownRoutes = useMemo(() => new Set(groups.flatMap(group => group.models.map(model => `${group.id}\u0000${model.id}`))), [groups])

  async function save(task: () => Promise<void>) {
    setStatus({ kind: 'saving', text: 'Saving…' })
    try {
      await task()
      setStatus({ kind: 'success', text: 'Saved' })
      window.setTimeout(() => setStatus(value => value.kind === 'success' ? { kind: 'idle', text: '' } : value), 1800)
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof Error ? error.message : String(error) })
    }
  }

  async function chooseRoute(value: string) {
    await save(async () => {
      if (value === 'conversation') {
        await settings.set('routeMode', 'conversation')
        return
      }
      const [provider, model] = value.split('\u0000')
      // Keep every live snapshot routable while changing a fixed provider/model pair.
      await settings.set('routeMode', 'conversation')
      await settings.set('provider', provider)
      await settings.set('model', model)
      await settings.set('routeMode', 'fixed')
    })
  }

  function numberField(field: keyof TitleSettings, fallback: number, min: number, max: number, id?: string) {
    return <input
      key={`${field}:${current?.[field] ?? fallback}`}
      id={id}
      className="dact-input"
      type="number"
      min={min}
      max={max}
      defaultValue={String(current?.[field] ?? fallback)}
      disabled={!snapshot.writable}
      onBlur={event => {
        const input = event.currentTarget
        const accepted = current?.[field] ?? fallback
        const value = Number(input.value)
        if (!Number.isSafeInteger(value) || value < min || value > max) {
          input.value = String(accepted)
          setStatus({ kind: 'error', text: `Enter a whole number from ${min} to ${max}.` })
          return
        }
        if (value === current?.[field]) {
          input.value = String(accepted)
          return
        }
        void save(() => settings.set(field, value))
      }}
    />
  }

  if (snapshot.status === 'unavailable') return null

  return <li className="dact-card" data-open={open}>
    <button
      type="button"
      className="dact-card-header"
      aria-expanded={open}
      aria-label={`${open ? 'Collapse' : 'Expand'}: Automatic chat titles`}
      onClick={() => setOpen(value => !value)}
    >
      <span className="dact-card-head">
        <span className="dact-card-name">Automatic chat titles</span>
        <span className="dact-card-description">Generate semantic titles automatically, with configurable model and regeneration context.</span>
      </span>
      <svg className="dact-card-chevron" viewBox="0 0 20 20" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>

    {open ? <div className="dact-card-body">
      {snapshot.status === 'loading' || current === undefined ? <p>Loading title settings…</p> : <>
        <div className="dact-fields">
          <div className="dact-field">
            <label className="dact-label" htmlFor="dact-route">Title model</label>
            <select id="dact-route" className="dact-input" value={routeValue} disabled={!snapshot.writable} onChange={event => void chooseRoute(event.currentTarget.value)}>
              <option value="conversation">Same as conversation</option>
              {routeValue !== 'conversation' && !knownRoutes.has(routeValue) ? <option value={routeValue}>{current.provider} / {current.model} (unlisted)</option> : null}
              {groups.map(group => <optgroup key={group.id} label={group.name}>
                {group.models.map(model => <option key={model.id} value={`${group.id}\u0000${model.id}`}>{model.name}</option>)}
              </optgroup>)}
            </select>
            <p className="dact-hint">Follow the chat model or choose a dedicated inexpensive model.</p>
          </div>

          <div className="dact-field">
            <label className="dact-label" htmlFor="dact-words">Title length</label>
            {numberField('targetWords', 5, 1, 20, 'dact-words')}
            <p className="dact-hint">Target words for non-CJK languages.</p>
          </div>

          <div className="dact-field">
            <label className="dact-label" htmlFor="dact-messages">Regeneration context</label>
            {numberField('maxMessages', 12, 1, 100, 'dact-messages')}
            <p className="dact-hint">Recent human messages used by Regenerate title.</p>
          </div>
        </div>

        <details>
          <summary>Advanced generation limits</summary>
          <div className="dact-fields">
            <div className="dact-field">
              <label className="dact-label" htmlFor="dact-cjk">CJK title characters</label>
              {numberField('targetCjkCharacters', 10, 1, 40, 'dact-cjk')}
              <p className="dact-hint">Target title length for CJK languages.</p>
            </div>
            <div className="dact-field">
              <label className="dact-label" htmlFor="dact-input-bytes">Maximum input bytes</label>
              {numberField('maxInputBytes', 8192, 256, 65536, 'dact-input-bytes')}
              <p className="dact-hint">Bound the conversation context sent for title generation.</p>
            </div>
            <div className="dact-field">
              <label className="dact-label" htmlFor="dact-output-tokens">Maximum output tokens</label>
              {numberField('maxOutputTokens', 64, 8, 256, 'dact-output-tokens')}
              <p className="dact-hint">Bound the title model response.</p>
            </div>
            <div className="dact-field">
              <label className="dact-label" htmlFor="dact-timeout">Timeout</label>
              {numberField('timeoutMs', 60000, 1000, 300000, 'dact-timeout')}
              <p className="dact-hint">Maximum generation time in milliseconds.</p>
            </div>
          </div>
        </details>

        {catalogFailures.length > 0 ? <p className="dact-message" data-kind="error">Some model catalogs could not load: {catalogFailures.join('; ')}</p> : null}
        <div className="dact-footer">
          <div className="dact-footer-copy">
            {status.text ? <span className="dact-status" data-kind={status.kind}>{status.text}</span> : null}
            {!snapshot.writable ? <span className="dact-status">Settings are read-only in this runtime.</span> : null}
          </div>
          <button className="dact-button" type="button" disabled={!snapshot.writable} onClick={() => void save(async () => {
            for (const field of ['routeMode', 'provider', 'model', 'targetWords', 'targetCjkCharacters', 'maxInputBytes', 'maxOutputTokens', 'timeoutMs', 'maxMessages']) await settings.unset(field)
          })}>Reset defaults</button>
        </div>
      </>}
    </div> : null}
  </li>
}

export function apply(ctx: Context): void {
  ctx.effect(installStyles, 'auto-chat-titles: styles')

  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'auto-chat-titles-regenerate',
    order: 100,
    label: () => 'Regenerate title',
    inject: () => ({
      regenerate: async (sessionId: SessionId) => {
        const scoped = ctx.sessions.scope(sessionId)
        const session = scoped === undefined ? undefined : ctx.sessions.sessionOf(scoped)
        if (session === undefined) throw new Error('Session is not available')
        const result = await session.command('/regenerate-title')
        if (!result.ok) throw new Error(result.error.message)
        if (!result.value.matched) throw new Error('Regenerate-title command is unavailable')
      },
    }),
  }, RegenerateAction))

  const api = ctx.get('connection').api
  const loadModels = async () => {
    const response = await api.llm.models({})
    if (!response.result.ok) throw new Error(response.result.error.message)
    return {
      groups: response.result.value.groups,
      failures: response.result.value.failures.map((failure: { name: string; message: string }) => `${failure.name}: ${failure.message}`),
    }
  }
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: NS,
    inject: () => ({
      settings: ctx.settingsScope.bind<TitleSettings>({ namespace: NS, decode: decodeSettings }),
      loadModels,
    }),
  }, SettingsCard))
}
