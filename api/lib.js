// Pure helpers for api/chat.js (kept separate so they can be unit-tested).

export const MAX_MSG_CHARS = 1200
export const MAX_TURNS = 6

/**
 * Keep only well-formed turns, cap their size and count, and guarantee the
 * conversation ends with a user message and strictly alternates roles
 * (the Messages API rejects anything else). Returns null if unusable.
 */
export function sanitizeMessages(input) {
  if (!Array.isArray(input)) return null
  const clean = input
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MSG_CHARS) }))
  while (clean.length && clean[0].role !== 'user') clean.shift()
  const alt = []
  for (const m of clean) {
    const last = alt[alt.length - 1]
    if (last && last.role === m.role) alt[alt.length - 1] = m
    else alt.push(m)
  }
  if (!alt.length || alt[alt.length - 1].role !== 'user') return null
  return alt
}

/** Same-site requests only (browser sends Origin on POST). Extra origins via ALLOWED_ORIGINS="https://a.com,https://b.com". */
export function isAllowedOrigin(origin, host, extra) {
  if (!origin) return false
  let o
  try { o = new URL(origin) } catch { return false }
  if (host && o.host === host) return true
  return (extra ?? '').split(',').map((s) => s.trim()).filter(Boolean).includes(o.origin)
}

/** Unique, valid article ids cited as [[id]] in the model output. */
export function extractCites(text, validIds) {
  return [...new Set([...text.matchAll(/\[\[([a-z0-9-]+)\]\]/g)].map((m) => m[1]))].filter((id) => validIds.has(id))
}
