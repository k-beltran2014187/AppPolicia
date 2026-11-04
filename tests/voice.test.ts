import { describe, it, expect } from 'vitest'
import { cleanForSpeech } from '../src/voice'

describe('cleanForSpeech', () => {
  it('quita marcas de formato, ids y viñetas', () => {
    const out = cleanForSpeech('**No.** Depende [[cprg-25]]\n- Pide el motivo [[cprg-6]]\n- Anota el número')
    expect(out).not.toMatch(/\[\[|\*\*|^- /)
    expect(out).toContain('Pide el motivo')
  })
  it('lee "art." como artículo', () => {
    expect(cleanForSpeech('Ver art. 25')).toBe('Ver artículo 25')
  })
})
