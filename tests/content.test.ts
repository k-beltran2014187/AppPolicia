import { describe, expect, it } from 'vitest'
import { ARTICLES } from '../src/data/laws'
import { SCENARIOS } from '../src/data/scenarios'
import { localSearch, cleanAnswer } from '../src/search'

const ids = new Set(ARTICLES.map((a) => a.id))

describe('legal library', () => {
  it('has unique article ids', () => {
    expect(ids.size).toBe(ARTICLES.length)
  })
  it('every article has Spanish and English text', () => {
    for (const a of ARTICLES) {
      expect(a.title.es && a.title.en && a.summary.es && a.summary.en, a.id).toBeTruthy()
    }
  })
  it('every scenario reference points to an existing article', () => {
    const missing: string[] = []
    for (const s of SCENARIOS) {
      for (const list of [s.checklist, s.civilDo, s.civilAvoid, s.officer]) {
        for (const p of list) for (const r of p.refs ?? []) if (!ids.has(r)) missing.push(`${s.id}:${r}`)
      }
    }
    expect(missing).toEqual([])
  })
})

describe('localSearch', () => {
  it('finds articles by keyword, ignoring accents', () => {
    expect(localSearch('licencia').length).toBeGreaterThan(0)
  })
  it('returns nothing for stop words or empty input', () => {
    expect(localSearch('')).toEqual([])
    expect(localSearch('de la el')).toEqual([])
  })
  it('returns at most 4 results', () => {
    expect(localSearch('transito policia agente').length).toBeLessThanOrEqual(4)
  })
})

describe('cleanAnswer', () => {
  it('removes citation markers, including a half-streamed one', () => {
    expect(cleanAnswer('Sí [[cprg-25]] debe .')).toBe('Sí debe.')
    expect(cleanAnswer('Texto [[cprg-2')).toBe('Texto')
  })
})
