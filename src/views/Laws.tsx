import { useMemo, useState } from 'react'
import { UI, tr, useLang } from '../i18n'
import { ARTICLES, LAW_NAMES, type Law } from '../data/laws'
import { norm } from '../search'
import { Icon } from '../icons'

export default function Laws({ focus }: { focus?: string }) {
  const { lang } = useLang()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | undefined>(focus)

  const [law, setLaw] = useState<Law | 'all'>(() => (focus ? (ARTICLES.find((a) => a.id === focus)?.law ?? 'all') : 'all'))

  const items = useMemo(() => {
    const n = norm(q.trim())
    return ARTICLES.filter((a) => {
      if (law !== 'all' && a.law !== law) return false
      if (!n) return true
      return norm([a.art, LAW_NAMES[a.law].short, a.title.es, a.title.en, a.summary.es, a.summary.en, a.quote ?? ''].join(' ')).includes(n)
    })
  }, [q, law])

  const laws = Object.keys(LAW_NAMES) as Law[]

  return (
    <div className="stack">
      <h1>{tr(UI.laws, lang)}</h1>
      <p className="public-note"><Icon name="shield" size={16} /> {tr(UI.publicLaws, lang)}</p>
      <div className="filters" role="group" aria-label={tr(UI.laws, lang)}>
        <button className={law === 'all' ? 'on' : ''} onClick={() => setLaw('all')} aria-pressed={law === 'all'}>{tr(UI.allLaws, lang)} · {ARTICLES.length}</button>
        {laws.map((l) => (
          <button key={l} className={law === l ? 'on' : ''} onClick={() => setLaw(l)} aria-pressed={law === l}>
            {LAW_NAMES[l].short} · {ARTICLES.filter((a) => a.law === l).length}
          </button>
        ))}
      </div>
      <input className="field" type="search" aria-label={tr(UI.searchLaws, lang)} placeholder={tr(UI.searchLaws, lang)} value={q} onChange={(e) => setQ(e.target.value)} />
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
