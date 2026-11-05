import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { UI, tr, useLang, type L } from '../i18n'
import { ARTICLES, LAW_NAMES } from '../data/laws'
import type { Role } from '../App'
import { Icon } from '../icons'
import { Logo, LogoMark } from '../Logo'
import { cleanAnswer, localSearch } from '../search'
import { savePhoto } from '../db'
import { safe } from '../privacy'
import { canListen, canSpeak, listen, speak, stopSpeaking, type ListenError } from '../voice'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  cites?: string[]
  offline?: boolean
  error?: 'rate' | 'fail'
  /** Local notice (e.g. photo saved): shown in the log, never sent to the assistant. */
  note?: boolean
}

const SUGGESTIONS: L[] = [
  { es: 'Me pararon y solo hay dos policías, ¿es legal?', en: 'I was stopped and there are only two officers, is it legal?' },
  { es: '¿Pueden revisar mi celular?', en: 'Can they search my phone?' },
  { es: 'Me piden dinero para no ponerme la multa', en: 'They ask me for money to skip the fine' },
  { es: '¿Pueden retenerme la licencia?', en: 'Can they hold my license?' },
  { es: '¿Cómo denuncio a un policía que abusó?', en: 'How do I report an officer who abused me?' },
]

const FOREIGN_SUGGESTIONS: L[] = [
  { es: 'Soy extranjero y me pidieron mis documentos, ¿qué debo mostrar?', en: 'I am a foreign national and was asked for my documents, what must I show?' },
  { es: '¿Pueden quedarse con mi pasaporte?', en: 'Can they keep my passport?' },
  { es: 'Me detuvieron, ¿puedo llamar a mi consulado?', en: 'I was detained, can I call my consulate?' },
  { es: '¿Pueden detenerme por no tener documentos migratorios?', en: 'Can they arrest me for lacking migration documents?' },
  { es: '¿Puedo conducir con mi licencia extranjera?', en: 'Can I drive with my foreign license?' },
]

// The conversation is sensitive: it lives only in this tab (sessionStorage) and vanishes when it closes.
const STORE = 'poligt:chat'
const load = (): Msg[] => {
  try { return JSON.parse(sessionStorage.getItem(STORE) ?? '[]') } catch { return [] }
}

/** Renders **bold**, "- " bullets and paragraphs without interpreting any HTML. */
function Rich({ text }: { text: string }) {
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
    )
  const blocks: ({ type: 'p'; t: string } | { type: 'ul'; items: string[] })[] = []
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*[-*•]\s+(.*)$/)
    if (m) {
      const last = blocks[blocks.length - 1]
      if (last?.type === 'ul') last.items.push(m[1])
      else blocks.push({ type: 'ul', items: [m[1]] })
    } else if (line.trim()) blocks.push({ type: 'p', t: line })
  }
  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'p' ? <p key={i} className="msg-p">{inline(b.t)}</p> : (
          <ul key={i} className="msg-ul">{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>
        ),
      )}
    </>
  )
}

const CALLS: { tel: string; show: string; name: L }[] = [
  { tel: '110', show: '110', name: { es: 'PNC – Emergencias', en: 'PNC – Emergencies' } },
  { tel: '1555', show: '1555', name: { es: 'PDH – Derechos Humanos', en: 'PDH – Human Rights' } },
  { tel: '1531', show: '1531', name: { es: 'Denuncia policial (anónima)', en: 'Police misconduct (anonymous)' } },
]

export default function Chat({ role, foreigner, openArticle, go }: { role: Role; foreigner: boolean; openArticle: (id: string) => void; go: (v: string) => void }) {
  const { lang } = useLang()
  const [msgs, setMsgs] = useState<Msg[]>(load)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [sheet, setSheet] = useState<'none' | 'attach' | 'call'>('none')
  const [listening, setListening] = useState(false)
  const [voiceMsg, setVoiceMsg] = useState('')
  const [speakAll, setSpeakAll] = useState(() => safe.get('poligt:speak') === '1')
  const [speaking, setSpeaking] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  const abort = useRef<AbortController | null>(null)
  const mic = useRef<{ stop: () => void } | null>(null)
  const photo = useRef<HTMLInputElement>(null)
  const listenSupported = canListen()

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30))) } catch { /* ignore */ }
    if (msgs.length || busy) end.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [msgs, busy])
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => { alive.current = false; abort.current?.abort(); mic.current?.stop(); stopSpeaking() }
  }, [])

  const toggleSpeak = () => {
    const v = !speakAll
    setSpeakAll(v)
    safe.set('poligt:speak', v ? '1' : '0')
    if (!v) { stopSpeaking(); setSpeaking(false) }
  }

  const say = (text: string) => {
    setSpeaking(true)
    speak(text, lang, () => setSpeaking(false))
  }

  const fallback = (next: Msg[], content: string, error?: 'rate' | 'fail') => {
    const cites = error === 'rate' ? [] : localSearch(content)
    setMsgs([
      ...next,
      {
        role: 'assistant',
        offline: error !== 'rate',
        error,
        content: error === 'rate' ? tr(UI.rateLimited, lang) : cites.length ? tr(UI.offlineFound, lang) : tr(UI.offlineNone, lang),
        cites,
      },
    ])
  }

  const send = async (raw: string, byVoice = false) => {
    const content = raw.trim()
    if (!content || busy) return
    stopSpeaking()
    setSpeaking(false)
    setSheet('none')
    setVoiceMsg('')
    const next: Msg[] = [...msgs, { role: 'user', content }]
    setMsgs(next)
    setInput('')
    setBusy(true)
    const ctl = new AbortController()
    abort.current = ctl
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: ctl.signal,
        body: JSON.stringify({
          role,
          lang,
          foreigner,
          messages: next.filter((m) => !m.offline && !m.error && !m.note).map(({ role, content }) => ({ role, content })),
        }),
      })
      if (res.status === 429) return fallback(next, content, 'rate')
      if (!res.ok || !res.body) throw new Error(String(res.status))

      // Read the NDJSON stream: {"t": "..."} deltas, then {"done": true, "cites": [...]}.
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      let text = ''
      let cites: string[] = []
      let failed = false
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        let i
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim()
          buf = buf.slice(i + 1)
          if (!line) continue
          const ev = JSON.parse(line) as { t?: string; done?: boolean; cites?: string[]; error?: string }
          if (ev.error) failed = true
          if (ev.t) {
            text += ev.t
            setMsgs([...next, { role: 'assistant', content: cleanAnswer(text) }])
          }
          if (ev.done) cites = ev.cites ?? []
        }
      }
      if (failed && !text) throw new Error('stream')
      const answer = cleanAnswer(text)
      setMsgs([...next, { role: 'assistant', content: answer, cites }])
      if (byVoice || speakAll) say(answer)
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      fallback(next, content, 'fail')
    } finally {
      setBusy(false)
    }
  }

  const stopAnswer = () => { abort.current?.abort(); stopSpeaking(); setSpeaking(false) }

  const toggleMic = () => {
    if (listening) return mic.current?.stop()
    if (!listenSupported) return setVoiceMsg(tr(UI.micUnsupported, lang))
    stopSpeaking()
    setSpeaking(false)
    setSheet('none')
    setVoiceMsg('')
    setListening(true)
    mic.current = listen(lang, {
      onText: (t) => setInput(t),
      onDone: (t, err?: ListenError) => {
        if (!alive.current) return
        setListening(false)
        mic.current = null
        if (t) void send(t, true)
        else {
          setInput('')
          setVoiceMsg(err === 'denied' ? tr(UI.micDenied, lang) : err === 'fail' ? tr(UI.micUnsupported, lang) : tr(UI.micNone, lang))
        }
      },
    })
  }

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    let ok = true
    try { await savePhoto(f) } catch { ok = false }
    setMsgs((m) => [...m, { role: 'assistant', note: true, content: ok ? tr(UI.photoSaved, lang) : tr(UI.photoFailed, lang) }])
  }

  const newChat = () => { stopAnswer(); setMsgs([]); setVoiceMsg('') }

  return (
    <div className="chat">
      <div className="chat-bar">
        <LogoMark size={30} />
        <div>
          <strong>SOSgt</strong>
          <span className="small muted">{tr(UI.mikeRole, lang)}</span>
        </div>
        {canSpeak() && (
          <button className={`icon-btn ${speakAll ? 'on' : ''}`} onClick={toggleSpeak} aria-pressed={speakAll} aria-label={tr(speakAll ? UI.speakOn : UI.speakOff, lang)} title={tr(speakAll ? UI.speakOn : UI.speakOff, lang)}>
            <Icon name={speakAll ? 'speaker' : 'mute'} size={20} />
          </button>
        )}
        {msgs.length > 0 && (
          <button className="icon-btn" onClick={newChat} aria-label={tr(UI.newChat, lang)} title={tr(UI.newChat, lang)}>
            <Icon name="newchat" size={20} />
          </button>
        )}
      </div>

      <div className="chat-log" role="log" aria-live="polite" aria-relevant="additions text">
        {msgs.length === 0 && (
          <div className="chat-empty">
            <Logo height={64} />
            <h1>{tr(UI.greeting, lang)}</h1>
            <p className="lead">{tr(UI.greetingSub, lang)}</p>
            <div className="suggestions">
              {(foreigner ? FOREIGN_SUGGESTIONS : SUGGESTIONS).map((s, i) => (
                <button key={i} className="suggest" onClick={() => send(tr(s, lang))}>{tr(s, lang)}</button>
              ))}
            </div>
            <p className="small muted row-ico"><Icon name="lock" size={14} /> {tr(UI.aiPrivacy, lang)}{listenSupported ? ` ${tr(UI.voiceNote, lang)}` : ''}</p>
          </div>
        )}
        {msgs.map((m, i) =>
          m.note ? (
            <div key={i} className="chat-note" role="status">
              <Icon name="camera" size={16} /> {m.content}{' '}
              <button className="linklike" onClick={() => go('record')}>{tr(UI.viewSaved, lang)}</button>
            </div>
          ) : (
            <div key={i} className={`bubble ${m.role}`}>
              {m.role === 'assistant' && <span className="bubble-who"><LogoMark size={18} /> SOSgt</span>}
              {m.offline && <span className="tag pend">{tr(UI.offlineTag, lang)}</span>}
              <Rich text={m.content} />
              {!!m.cites?.length && <span className="src-label">{tr(UI.legalBasis, lang)}</span>}
              {m.cites?.map((id) => {
                const a = ARTICLES.find((x) => x.id === id)
                return a ? (
                  <button key={id} className="chip ok" onClick={() => openArticle(id)} title={a.verified === 'leido' ? tr(UI.verifiedChip, lang) : tr(UI.notRead, lang)}>
                    {a.verified === 'leido' && <Icon name="check" size={12} />}
                    {LAW_NAMES[a.law].short} art. {a.art}
                  </button>
                ) : null
              })}
            </div>
          ),
        )}
        {busy && !msgs.at(-1)?.role.startsWith('assistant') && (
          <div className="bubble assistant">
            <span className="bubble-who"><LogoMark size={18} /> SOSgt</span>
            <span className="typing" aria-label={tr(UI.thinking, lang)}><i /><i /><i /></span>
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="composer">
        {sheet !== 'none' && (
          <div className="sheet" role="menu">
            {sheet === 'attach' ? (
              <>
                <button role="menuitem" onClick={() => go('record')}><span className="sheet-ico rec"><Icon name="record" size={22} /></span>{tr(UI.attachRecord, lang)}</button>
                <button role="menuitem" onClick={() => { setSheet('none'); photo.current?.click() }}><span className="sheet-ico"><Icon name="camera" size={22} /></span>{tr(UI.attachPhoto, lang)}</button>
                <button role="menuitem" onClick={() => setSheet('call')}><span className="sheet-ico call"><Icon name="phone" size={22} /></span>{tr(UI.attachCall, lang)}</button>
              </>
            ) : (
              <>
                <p className="sheet-title">{tr(UI.callTitle, lang)}</p>
                {CALLS.map((c) => (
                  <a key={c.tel} role="menuitem" className="sheet-call" href={`tel:${c.tel}`}>
                    <span className="sheet-ico call"><Icon name="phone" size={22} /></span>
                    <span><strong>{c.show}</strong> <small>{tr(c.name, lang)}</small></span>
                  </a>
                ))}
                <button role="menuitem" onClick={() => go('denuncia')}><span className="sheet-ico"><Icon name="badge" size={22} /></span>{tr(UI.denounceTitle, lang)}</button>
              </>
            )}
          </div>
        )}
        {(listening || voiceMsg || speaking) && (
          <p className={`voice-status ${listening ? 'live' : ''}`} role="status">
            {listening ? tr(UI.listening, lang) : speaking ? tr(UI.speakOn, lang) : voiceMsg}
          </p>
        )}
        <input ref={photo} type="file" accept="image/*" capture="environment" hidden onChange={onPhoto} />
        <form className="composer-box" onSubmit={(e) => { e.preventDefault(); void send(input) }}>
          <button type="button" className={`cbtn ${sheet !== 'none' ? 'on' : ''}`} onClick={() => setSheet(sheet === 'none' ? 'attach' : 'none')} aria-expanded={sheet !== 'none'} aria-label={tr(UI.attachMore, lang)}>
            <Icon name={sheet === 'none' ? 'plus' : 'x'} size={22} />
          </button>
          <input
            id="chat-q"
            className="composer-field"
            aria-label={tr(UI.chatLabel, lang)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setSheet('none')}
            placeholder={listening ? tr(UI.listening, lang) : tr(UI.chatPlaceholder, lang)}
            maxLength={1000}
            autoComplete="off"
            readOnly={listening}
          />
          {busy ? (
            <button className="cbtn solid stopbtn" type="button" onClick={stopAnswer} aria-label={tr(UI.stopAnswer, lang)}><Icon name="stop" size={18} fill="currentColor" /></button>
          ) : input.trim() && !listening ? (
            <button className="cbtn solid" type="submit" aria-label={tr(UI.send, lang)}><Icon name="send" size={22} /></button>
          ) : (
            <button className={`cbtn solid ${listening ? 'live' : ''}`} type="button" onClick={toggleMic} aria-pressed={listening} aria-label={tr(listening ? UI.micStop : UI.micStart, lang)}>
              <Icon name={listening ? 'stop' : 'mic'} size={listening ? 18 : 22} fill={listening ? 'currentColor' : 'none'} />
            </button>
          )}
        </form>
        <p className="small muted center composer-note">{tr(UI.notLawyer, lang)}</p>
      </div>
    </div>
  )
}