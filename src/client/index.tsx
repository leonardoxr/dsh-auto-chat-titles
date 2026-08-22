import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { ModelProviderGroup, SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'

const PLUGIN_ID = 'dsh-auto-chat-titles'
const NS = 'auto-chat-titles'
const STYLE_ID = 'dsh-auto-chat-titles/styles'

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
  tag.textContent = `
    .dact-action{border:1px solid var(--dsw-alias-border-l2);height:32px;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:transparent;border-radius:18px;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;font-size:13px;line-height:20px}
    .dact-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
    .dact-action:disabled{color:var(--dsw-alias-label-dimmed);cursor:wait}
    .dact-spin{width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:dact-spin .7s linear infinite}
    @keyframes dact-spin{to{transform:rotate(360deg)}}
    .dact-card{max-width:720px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:14px;padding:4px 0}
    .dact-card h3{font-size:16px;line-height:24px;margin:0;font-weight:600}
    .dact-card p{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;margin:0}
    .dact-grid{display:grid;grid-template-columns:minmax(150px,220px) minmax(220px,1fr);gap:12px 18px;align-items:center}
    .dact-label{display:flex;flex-direction:column;gap:2px;font-size:14px}
    .dact-label small{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
    .dact-input{box-sizing:border-box;width:100%;min-height:36px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:6px 10px;font:inherit}
    .dact-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .dact-button{border:1px solid var(--dsw-alias-border-l2);border-radius:18px;background:transparent;color:var(--dsw-alias-label-primary);padding:7px 14px;font:inherit;cursor:pointer}
    .dact-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
    .dact-status{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
    .dact-status[data-kind="error"]{color:var(--dsw-alias-state-error-primary)}
    .dact-status[data-kind="success"]{color:var(--dsw-alias-state-success-primary)}
    .dact-card details{border-top:1px solid var(--dsw-alias-border-l3);padding-top:12px}
    .dact-card summary{cursor:pointer;font-size:13px;color:var(--dsw-alias-label-secondary);margin-bottom:12px}
    @media(max-width:640px){.dact-grid{grid-template-columns:1fr;gap:6px}.dact-grid>.dact-input{margin-bottom:8px}}
  `
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
  const snapshot = useSyncExternalStore(settings.subscribe, settings.getSnapshot, settings.getSnapshot)
  const current = snapshot.value
  const [groups, setGroups] = useState<ModelProviderGroup[]>([])
  const [catalogFailures, setCatalogFailures] = useState<string[]>([])
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'success' | 'error'; text: string }>({ kind: 'idle', text: '' })

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

  if (snapshot.status === 'loading') return <div className="dact-card"><p>Loading title settings…</p></div>
  if (snapshot.status === 'unavailable' || current === undefined) {
    return <div className="dact-card"><h3>Automatic chat titles</h3><p>The host title-settings namespace is unavailable. Confirm that the host plugin is enabled.</p></div>
  }

  return <div className="dact-card">
    <div>
      <h3>Automatic chat titles</h3>
      <p>Generate semantic titles automatically from the first prompt, then regenerate from recent conversation context whenever needed.</p>
    </div>

    <div className="dact-grid">
      <label className="dact-label" htmlFor="dact-route">Title model<small>Follow the chat model or choose a dedicated inexpensive model.</small></label>
      <select id="dact-route" className="dact-input" value={routeValue} disabled={!snapshot.writable} onChange={event => void chooseRoute(event.currentTarget.value)}>
        <option value="conversation">Same as conversation</option>
        {routeValue !== 'conversation' && !knownRoutes.has(routeValue) ? <option value={routeValue}>{current.provider} / {current.model} (unlisted)</option> : null}
        {groups.map(group => <optgroup key={group.id} label={group.name}>
          {group.models.map(model => <option key={model.id} value={`${group.id}\u0000${model.id}`}>{model.name}</option>)}
        </optgroup>)}
      </select>

      <label className="dact-label" htmlFor="dact-words">Title length<small>Target words for non-CJK languages.</small></label>
      {numberField('targetWords', 5, 1, 20, 'dact-words')}

      <label className="dact-label" htmlFor="dact-messages">Regeneration context<small>Recent human messages used by Regenerate title.</small></label>
      {numberField('maxMessages', 12, 1, 100, 'dact-messages')}
    </div>

    <details>
      <summary>Advanced generation limits</summary>
      <div className="dact-grid">
        <span className="dact-label">CJK title characters</span>{numberField('targetCjkCharacters', 10, 1, 40)}
        <span className="dact-label">Maximum input bytes</span>{numberField('maxInputBytes', 8192, 256, 65536)}
        <span className="dact-label">Maximum output tokens</span>{numberField('maxOutputTokens', 64, 8, 256)}
        <span className="dact-label">Timeout (milliseconds)</span>{numberField('timeoutMs', 60000, 1000, 300000)}
      </div>
    </details>

    <div className="dact-row">
      <button className="dact-button" type="button" disabled={!snapshot.writable} onClick={() => void save(async () => {
        for (const field of ['routeMode', 'provider', 'model', 'targetWords', 'targetCjkCharacters', 'maxInputBytes', 'maxOutputTokens', 'timeoutMs', 'maxMessages']) await settings.unset(field)
      })}>Reset defaults</button>
      {status.text ? <span className="dact-status" data-kind={status.kind}>{status.text}</span> : null}
      {!snapshot.writable ? <span className="dact-status">Settings are read-only in this runtime.</span> : null}
    </div>
    {catalogFailures.length > 0 ? <p className="dact-status" data-kind="error">Some model catalogs could not load: {catalogFailures.join('; ')}</p> : null}
  </div>
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

  const settings = ctx.settingsScope.bind<TitleSettings>({ namespace: NS, decode: decodeSettings })
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
    locale: NS,
    inject: () => ({ settings, loadModels }),
  }, SettingsCard))
}
