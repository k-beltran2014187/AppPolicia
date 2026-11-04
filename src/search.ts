import { ARTICLES, LAW_NAMES } from './data/laws'

const STOP = new Set(['de', 'la', 'el', 'en', 'y', 'a', 'que', 'es', 'me', 'mi', 'un', 'una', 'los', 'las', 'por', 'con', 'para', 'del', 'al', 'se', 'lo', 'the', 'is', 'and', 'to', 'of', 'my', 'can', 'they', 'i'])

export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/** Keyword search over the local article library, used when the assistant is unreachable. */
export function localSearch(q: string): string[] {
  const words = norm(q).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w))
  if (!words.length) return []
  const scored = ARTICLES.map((a) => {
    const hay = norm([a.title.es, a.title.en, a.summary.es, a.summary.en, LAW_NAMES[a.law].short].join(' '))
    return { id: a.id, score: words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0) }
  })
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((s) => s.id)
}

/** Remove [[id]] markers, including a half-streamed one at the end. */
export function cleanAnswer(text: string) {
  return text
    .replace(/\[\[[a-z0-9-]+\]\]/g, '')
    .replace(/\[\[[a-z0-9-]*$/, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ +\n/g, '\n')
    .replace(/ +([.,;:])/g, '$1')
    .trim()
}

