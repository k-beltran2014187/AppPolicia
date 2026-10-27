import { useState } from 'react'
import { UI, tr, useLang, type L } from '../i18n'

const CONTACTS: { name: L; desc: L; tel: string }[] = [
  { name: { es: 'PNC – Emergencias', en: 'PNC – Emergencies' }, desc: { es: 'Delitos en curso, violencia, asaltos', en: 'Crimes in progress, violence, robberies' }, tel: '110' },
  { name: { es: 'PDH – Procurador de los Derechos Humanos', en: 'PDH – Human Rights Ombudsman' }, desc: { es: 'Denunciar abusos de autoridad', en: 'Report abuse of authority' }, tel: '1555' },
  { name: { es: 'Ministerio Público – línea general', en: 'Public Ministry – general line' }, desc: { es: 'Denuncias y asesoría', en: 'Complaints and guidance' }, tel: '24119191' },
]

export default function Help() {
  const { lang } = useLang()
  const [trusted, setTrusted] = useState(() => {
    try { return localStorage.getItem('poligt:trusted') ?? '' } catch { return '' }
  })
  const [loc, setLoc] = useState('')

  const saveTrusted = (v: string) => {
    setTrusted(v)
    try { localStorage.setItem('poligt:trusted', v) } catch { /* ignore */ }
  }
  const share = () => {
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const link = `https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`
        const msg = lang === 'es' ? `Me detuvo la autoridad. Mi ubicación: ${link}` : `I was stopped by authorities. My location: ${link}`
        setLoc(link)
        const num = trusted.replace(/\D/g, '')
        window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank')
      },
      () => setLoc('—'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="stack">
      <h1>📞 {tr(UI.help, lang)}</h1>
      <section className="panel">
        <h2>📍 {tr(UI.shareLoc, lang)}</h2>
        <p className="muted">{tr(UI.shareLocSub, lang)}</p>
        <label className="small">{tr(UI.trusted, lang)}</label>
        <input className="field" inputMode="tel" placeholder={tr(UI.trustedHint, lang)} value={trusted} onChange={(e) => saveTrusted(e.target.value)} />
        <button className="big" onClick={share}>{tr(UI.shareLoc, lang)}</button>
        {loc && <p className="small muted">{loc}</p>}
      </section>
      <h2>{tr(UI.contacts, lang)}</h2>
      {CONTACTS.map((c) => (
        <div key={c.tel} className="panel row between">
          <div>
            <strong>{tr(c.name, lang)}</strong>
            <p className="small muted">{tr(c.desc, lang)} · {c.tel}</p>
          </div>
          <a className="btn" href={`tel:${c.tel}`}>{tr(UI.call, lang)}</a>
        </div>
      ))}
      <p className="small muted">⚠️ {tr(UI.verifyNumber, lang)}</p>
    </div>
  )
}
