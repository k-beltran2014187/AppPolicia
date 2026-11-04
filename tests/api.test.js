import { describe, expect, it } from 'vitest'
import { extractCites, isAllowedOrigin, MAX_MSG_CHARS, MAX_TURNS, sanitizeMessages } from '../api/lib.js'

describe('sanitizeMessages', () => {
  it('rejects non-arrays and conversations that do not end with the user', () => {
    expect(sanitizeMessages(undefined)).toBeNull()
    expect(sanitizeMessages([])).toBeNull()
    expect(sanitizeMessages([{ role: 'user', content: 'hola' }, { role: 'assistant', content: 'ok' }])).toBeNull()
  })
  it('drops unknown roles, empty text and non-strings', () => {
    const out = sanitizeMessages([{ role: 'system', content: 'x' }, { role: 'user', content: '  ' }, { role: 'user', content: 5 }, { role: 'user', content: 'hola' }])
    expect(out).toEqual([{ role: 'user', content: 'hola' }])
  })
  it('starts with a user turn and alternates roles', () => {
    const out = sanitizeMessages([
      { role: 'assistant', content: 'a' },
      { role: 'user', content: 'u1' },
      { role: 'user', content: 'u2' },
      { role: 'assistant', content: 'a2' },
      { role: 'user', content: 'u3' },
    ])
    expect(out.map((m) => m.role)).toEqual(['user', 'assistant', 'user'])
    expect(out[0].content).toBe('u2')
  })
  it('caps length and number of turns', () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x'.repeat(5000) }))
    many.push({ role: 'user', content: 'fin' })
    const out = sanitizeMessages(many)
    expect(out.length).toBeLessThanOrEqual(MAX_TURNS)
    expect(out.every((m) => m.content.length <= MAX_MSG_CHARS)).toBe(true)
  })
})

describe('isAllowedOrigin', () => {
  it('accepts same host and rejects missing or foreign origins', () => {
    expect(isAllowedOrigin('https://app.vercel.app', 'app.vercel.app')).toBe(true)
    expect(isAllowedOrigin(null, 'app.vercel.app')).toBe(false)
    expect(isAllowedOrigin('https://evil.example', 'app.vercel.app')).toBe(false)
    expect(isAllowedOrigin('not a url', 'app.vercel.app')).toBe(false)
  })
  it('accepts extra origins from ALLOWED_ORIGINS', () => {
    expect(isAllowedOrigin('https://mi.dominio.gt', 'x.vercel.app', 'https://mi.dominio.gt, https://otro.gt')).toBe(true)
  })
})

describe('extractCites', () => {
  it('keeps only valid, unique ids', () => {
    const valid = new Set(['cprg-25', 'lt-14'])
    expect(extractCites('a [[cprg-25]] b [[cprg-25]] [[inventado-9]] [[lt-14]]', valid)).toEqual(['cprg-25', 'lt-14'])
  })
})
