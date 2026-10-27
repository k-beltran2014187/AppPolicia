import { useEffect, useRef, useState } from 'react'
import { UI, tr, useLang, type L } from '../i18n'
import { ARTICLES, LAW_NAMES } from '../data/laws'
import type { Role } from '../App'
import { Icon } from '../icons'
import Mike from '../Mike'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  cites?: string[]
  offline?: boolean
}

const SUGGESTIONS: L[] = [
  { es: 'Me pararon y solo hay dos policías, ¿es legal?', en: 'I was stopped and there are only two officers, is it legal?' },
  { es: '¿Pueden revisar mi celular?', en: 'Can they search my phone?' },
  { es: 'Me piden dinero para no ponerme la multa', en: 'They ask me for money to skip the fine' },
  { es: '¿Pueden retenerme la licencia?', en: 'Can they hold my license?' },
]

const STORE = 'poligt:chat'
const stop = new Set(['de', 'la', 'el', 'en', 'y', 'a', 'que', 'es', 'me', 'mi', 'un', 'una', 'los', 'las', 'por', 'con', 'para', 'del', 'al', 'se', 'lo', 'the', 'is', 'and', 'to', 'of', 'my', 'can', 'they', 'i'])
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Búsqueda local por palabras para cuando no hay internet o falla el servidor. */
function localSearch(q: string): string[] {
  const words = norm(q).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !stop.has(w))
  const scored = ARTICLES.map((a) => {
    const hay = norm([a.title.es, a.title.en, a.summary.es, a.summary.en, LAW_NAMES[a.law].short].join(' '))
    return { id: a.id, score: words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0) }
  })
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((s) => s.id)
}

function renderText(text: string) {
  return text.replace(/\[\[[a-z0-9-]+\]\]/g, '').replace(/ +\n/g, '\n').replace(/ +([.,;:])/g, '$1').trim()
}

/** Muestra **negrita** sin interpretar otro HTML. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
      )}
    </>
  )
}

export default function Chat({ role, openArticle, onLawyer }: { role: Role; openArticle: (id: string) => void; onLawyer: () => void }) {
  const { lang } = useLang()
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORE) ?? '[]') } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(msgs.slice(-30))) } catch { /* ignore */ }
    end.current?.scrollIntoView({ block: 'end' })
  }, [msgs, busy])

  const send = async (raw: string) => {
    const content = raw.trim()
    if (!content || busy) return
    const next: Msg[] = [...msgs, { role: 'user', content }]
    setMsgs(next)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ role, lang, messages: next.map(({ role, content }) => ({ role, content })) }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { text: string; cites: string[] }
      setMsgs([...next, { role: 'assistant', content: renderText(data.text), cites: data.cites }])
    } catch {
      const cites = localSearch(content)
      setMsgs([
        ...next,
        {
          role: 'assistant',
          offline: true,
          content: cites.length ? tr(UI.offlineFound, lang) : tr(UI.offlineNone, lang),
          cites,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      <div className="mike-head">
        <Mike size={48} />
        <div>
          <strong>Mike</strong>
          <span className="small muted">{tr(UI.mikeRole, lang)}</span>
        </div>
        <button className="btn small-btn" onClick={onLawyer}>{tr(UI.realLawyer, lang)}</button>
      </div>
      <div className="chat-log">
        {msgs.length === 0 && (
          <div className="stack">
            <p className="lead">{tr(UI.chatIntro, lang)}</p>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="suggest" onClick={() => send(tr(s, lang))}>{tr(s, lang)}</button>
            ))}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.role === 'assistant' && <span className="bubble-who"><Mike size={20} /> Mike</span>}
            {m.offline && <span className="tag pend">{tr(UI.offlineTag, lang)}</span>}
            <p className="pre"><Rich text={m.content} /></p>
            {m.cites?.map((id) => {
              const a = ARTICLES.find((x) => x.id === id)
              return a ? (
                <button key={id} className="chip" onClick={() => openArticle(id)}>
                  {LAW_NAMES[a.law].short} art. {a.art}
                </button>
              ) : null
            })}
          </div>
        ))}
        {busy && <div className="bubble assistant"><span className="bubble-who"><Mike size={20} /> Mike</span><span className="dots">{tr(UI.thinking, lang)}</span></div>}
        <div ref={end} />
      </div>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input) }}>
        <input
          id="chat-q"
          className="field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tr(UI.chatPlaceholder, lang)}
          maxLength={1000}
          autoComplete="off"
        />
        <button className="send" type="submit" disabled={busy || !input.trim()} aria-label={tr(UI.send, lang)}><Icon name="send" size={22} /></button>
      </form>
      <p className="small muted center">{tr(UI.notLawyer, lang)}</p>
      {msgs.length > 0 && (
        <button className="linklike" onClick={() => setMsgs([])}>{tr(UI.newChat, lang)}</button>
      )}
    </div>
  )
}
