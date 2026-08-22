import { describe, expect, it } from 'vitest'
import { resolveTitlePolicy, selectTitleMessages, validateSettings, type Config } from '../src/index.ts'

const base: Config = {
  routeMode: 'conversation',
  targetWords: 5,
  targetCjkCharacters: 10,
  maxInputBytes: 8192,
  maxOutputTokens: 64,
  timeoutMs: 60000,
  maxMessages: 12,
}

describe('title policy', () => {
  it('inherits the conversation route by default', () => {
    const result = resolveTitlePolicy(base)
    expect(result.provider).toBeUndefined()
    expect(result.model).toBeUndefined()
  })

  it('uses a fixed route when selected', () => {
    const result = resolveTitlePolicy({ ...base, routeMode: 'fixed', provider: ' openai ', model: ' mini ' })
    expect(result.provider).toBe('openai')
    expect(result.model).toBe('mini')
  })

  it('rejects incomplete fixed routes', () => {
    expect(() => validateSettings({ ...base, routeMode: 'fixed', provider: 'openai' })).toThrow(/model/i)
    expect(() => validateSettings({ ...base, routeMode: 'fixed', model: 'mini' })).toThrow(/provider/i)
  })
})

describe('message selection', () => {
  const messages = Array.from({ length: 5 }, (_, index) => ({ seq: index + 1, text: `message ${index + 1}` }))

  it('uses the most recent context window', () => {
    expect(selectTitleMessages(messages, 2).map(message => message.seq)).toEqual([4, 5])
  })

  it('keeps all messages when the window is larger', () => {
    expect(selectTitleMessages(messages, 10)).toEqual(messages)
  })

  it('rejects invalid context limits', () => {
    expect(() => selectTitleMessages(messages, 0)).toThrow(/positive integer/i)
  })
})
