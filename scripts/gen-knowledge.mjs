// Genera api/knowledge.js a partir de la biblioteca de leyes de la app.
// El agente del chat usa exactamente los mismos artículos que ve el usuario.
import { writeFileSync } from 'node:fs'
import { ARTICLES, LAW_NAMES } from '../src/data/laws.ts'

const text = ARTICLES.map((a) => {
  const law = LAW_NAMES[a.law].name.es
  const quote = a.quote ? `\n  Cita textual: "${a.quote}"` : ''
  const ver = a.verified === 'leido' ? 'texto leído en fuente oficial' : 'solo referencia, texto NO leído'
  return `[${a.id}] ${law}, art. ${a.art} - ${a.title.es} (${ver})\n  ${a.summary.es}${quote}`
}).join('\n\n')

const ids = ARTICLES.map((a) => a.id)
writeFileSync(
  new URL('../api/knowledge.js', import.meta.url),
  `// GENERADO por scripts/gen-knowledge.mjs. No editar a mano.\nexport const KNOWLEDGE = ${JSON.stringify(text)}\nexport const ARTICLE_IDS = ${JSON.stringify(ids)}\n`,
)
console.log(`knowledge: ${ids.length} artículos`)
