import { describe, expect, it } from 'vitest'
import { styles } from '../src/client/styles.ts'

describe('settings card visuals', () => {
  it('matches the standard plugin-card chrome', () => {
    expect(styles).toContain('border-radius:12px')
    expect(styles).toContain('background:var(--dsw-alias-bg-layer-3)')
    expect(styles).toContain('.dact-card[data-open=true]{background:var(--dsw-alias-bg-layer-2)')
    expect(styles).toContain('padding:14px 16px')
    expect(styles).toContain('.dact-card-body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px')
    expect(styles).toContain('.dact-input:focus-visible')
    expect(styles).not.toContain('max-width:720px')
    expect(styles).not.toContain('--dsw-alias-bg-elevated')
  })
})
