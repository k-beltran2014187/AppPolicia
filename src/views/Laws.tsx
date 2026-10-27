import { useMemo, useState } from 'react'
import { UI, tr, useLang } from '../i18n'
import { ARTICLES, LAW_NAMES } from '../data/laws'

export default function Laws({ focus }: { focus?: string }) {
  const { lang } = useLang()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | undefined>(focus)

  const items = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (!n) return ARTICLES
    return ARTICLES.filter((a) =>
      [a.art, LAW_NAMES[a.law].short, a.title.es, a.title.en, a.summary.es, a.summary.en].join(' ').toLowerCase().includes(n),
    )
  }, [q])

  return (
    <div className="stack">
      <h1>{tr(UI.laws, lang)}</h1>
      <input className="field" type="search" placeholder={tr(UI.searchLaws, lang)} value={q} onChange={(e) => setQ(e.target.value)} />
      {items.map((a) => {
        const law = LAW_NAMES[a.law]
        const isOpen = open === a.id
        return (
          <article key={a.id} id={a.id} className={`art ${isOpen ? 'open' : ''}`}>
            <button className="art-head" onClick={() => setOpen(isOpen ? undefined : a.id)} aria-expanded={isOpen}>
              <span className="badge">{law.short} · art. {a.art}</span>
              <strong>{tr(a.title, lang)}</strong>
            </button>
            {isOpen && (
              <div className="art-body">
                <p>{tr(a.summary, lang)}</p>
                {a.quote && <blockquote className="quote">“{a.quote}”</blockquote>}
                <p className="small muted">{tr(law.name, lang)}</p>
                <p className="small">
                  <span className={`tag ${a.verified}`}>{a.verified === 'leido' ? tr(UI.textRead, lang) : tr(UI.notRead, lang)}</span>{' '}
                  <span className="tag pend">{tr(UI.pending, lang)}</span>
                </p>
                <a className="small" href={law.source} target="_blank" rel="noreferrer">{tr(UI.source, lang)} ↗</a>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
