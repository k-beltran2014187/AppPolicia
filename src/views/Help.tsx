import { useState } from 'react'
import { UI, tr, useLang, type L } from '../i18n'
import { Icon } from '../icons'
import { clearPin, hasPin, safe, setPin, wipeAll } from '../privacy'

// Verify these numbers with the official sources before relying on them (the screen says so too).
const CONTACTS: { name: L; desc: L; tel: string }[] = [
  { name: { es: 'PNC – Emergencias', en: 'PNC – Emergencies' }, desc: { es: 'Delitos en curso, violencia, asaltos', en: 'Crimes in progress, violence, robberies' }, tel: '110' },
  { name: { es: 'PDH – Procurador de los Derechos Humanos', en: 'PDH – Human Rights Ombudsman' }, desc: { es: 'Denunciar abusos de autoridad', en: 'Report abuse of authority' }, tel: '1555' },
  { name: { es: 'Ministerio Público – línea general', en: 'Public Ministry – general line' }, desc: { es: 'Denuncias y asesoría', en: 'Complaints and guidance' }, tel: '24119191' },
]

function Location() {
  const { lang } = useLang()
  const [trusted, setTrusted] = useState(() => safe.get('poligt:trusted'))
  const [state, setState] = useState<'idle' | 'working' | 'failed'>('idle')
  const [msg, setMsg] = useState('')

  const saveTrusted = (v: string) => {
    setTrusted(v)
    safe.set('poligt:trusted', v)
  }
  const locate = () => {
    if (!navigator.geolocation) return setState('failed')
    setState('working')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const link = `https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`
        setMsg(lang === 'es' ? `Me detuvo la autoridad. Mi ubicación: ${link}` : `I was stopped by authorities. My location: ${link}`)
        setState('idle')
      },
      () => setState('failed'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }
  const num = trusted.replace(/\D/g, '')
  const text = encodeURIComponent(msg)
  // Plain links (not window.open after an async call) so pop-up blockers and iOS do not stop them.
  const wa = `https://wa.me/${num}?text=${text}`
  const sms = `sms:${num}?&body=${text}`
  const canShare = typeof navigator.share === 'function'

  return (
    <section className="panel">
      <h2 className="row-ico"><Icon name="pin" /> {tr(UI.shareLoc, lang)}</h2>
      <p className="muted">{tr(UI.shareLocSub, lang)}</p>
      <label className="lbl">
        {tr(UI.trusted, lang)}
        <input className="field" inputMode="tel" placeholder={tr(UI.trustedHint, lang)} value={trusted} onChange={(e) => saveTrusted(e.target.value)} />
      </label>
      <button className="big" onClick={locate} disabled={state === 'working'}>
        {state === 'working' ? tr(UI.locWorking, lang) : tr(UI.shareLoc, lang)}
      </button>
      {state === 'failed' && <p className="error" role="alert">{tr(UI.locFailed, lang)}</p>}
      {msg && (
        <div className="row wrap">
          <a className="btn" href={wa} target="_blank" rel="noreferrer">{tr(UI.shareWhatsApp, lang)}</a>
          <a className="btn" href={sms}>{tr(UI.shareSms, lang)}</a>
          {canShare && <button className="btn" onClick={() => navigator.share({ text: msg }).catch(() => {})}>{tr(UI.shareOther, lang)}</button>}
        </div>
      )}
    </section>
  )
}

function Privacy() {
  const { lang } = useLang()
  const [pin, setPinOn] = useState(hasPin())
  const [draft, setDraft] = useState('')
  const [asking, setAsking] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [note, setNote] = useState('')

  const savePin = async () => {
    if (!/^\d{4}$/.test(draft)) return
    await setPin(draft)
    setDraft('')
    setAsking(false)
    setPinOn(true)
    setNote(tr(UI.pinSaved, lang))
  }
  const wipe = async () => {
    await wipeAll()
    setConfirm(false)
    setPinOn(false)
    setNote(tr(UI.wipeDone, lang))
    window.setTimeout(() => window.location.reload(), 600)
  }

  return (
    <section className="panel">
      <h2 className="row-ico"><Icon name="lock" /> {tr(UI.privacyTitle, lang)}</h2>
      <p className="muted">{tr(UI.privacyHint, lang)}</p>

      {pin ? (
        <button className="btn" onClick={() => { clearPin(); setPinOn(false) }}>{tr(UI.pinOff, lang)}</button>
      ) : asking ? (
        <div className="row">
          <input
            className="field pin-field"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            autoFocus
            aria-label={tr(UI.pinNew, lang)}
            placeholder={tr(UI.pinNew, lang)}
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
          />
          <button className="btn" disabled={draft.length !== 4} onClick={savePin}>OK</button>
        </div>
      ) : (
        <button className="btn" onClick={() => setAsking(true)}>{tr(UI.pinSet, lang)}</button>
      )}

      {confirm ? (
        <div className="panel bad stack">
          <p>{tr(UI.wipeConfirm, lang)}</p>
          <div className="row">
            <button className="btn danger" onClick={wipe}>{tr(UI.confirm, lang)}</button>
            <button className="btn" onClick={() => setConfirm(false)}>{tr(UI.cancel, lang)}</button>
          </div>
        </div>
      ) : (
        <button className="btn danger" onClick={() => setConfirm(true)}>{tr(UI.wipeAll, lang)}</button>
      )}
      {note && <p className="small muted" role="status">{note}</p>}
    </section>
  )
}

export default function Help() {
  const { lang } = useLang()
  return (
    <div className="stack">
      <h1>{tr(UI.help, lang)}</h1>
      <Location />
      <h2>{tr(UI.contacts, lang)}</h2>
      {CONTACTS.map((c) => (
        <div key={c.tel} className="panel row between">
          <div>
            <strong>{tr(c.name, lang)}</strong>
            <p className="small muted">{tr(c.desc, lang)} · {c.tel}</p>
          </div>
          <a className="btn" href={`tel:${c.tel}`}><Icon name="help" size={18} /> {tr(UI.call, lang)}</a>
        </div>
      ))}
      <p className="small muted row-ico"><Icon name="alert" size={16} /> {tr(UI.verifyNumber, lang)}</p>
      <a className="btn" href="#denuncia"><Icon name="badge" size={18} /> {tr(UI.denounceTitle, lang)}</a>
      <Privacy />
    </div>
  )
}
