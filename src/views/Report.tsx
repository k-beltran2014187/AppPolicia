import { useState } from 'react'
import { UI, tr, useLang, type L } from '../i18n'

const FIELDS: { key: string; label: L; multiline?: boolean }[] = [
  { key: 'when', label: { es: 'Fecha y hora', en: 'Date and time' } },
  { key: 'where', label: { es: 'Lugar', en: 'Place' } },
  { key: 'agency', label: { es: 'Institución (PNC / EMETRA / PMT)', en: 'Agency (PNC / EMETRA / PMT)' } },
  { key: 'agent', label: { es: 'Nombre / número del agente', en: 'Officer name / number' } },
  { key: 'patrol', label: { es: 'Placa o número de patrulla', en: 'Patrol plate or number' } },
  { key: 'reason', label: { es: 'Motivo indicado', en: 'Reason given' } },
  { key: 'story', label: { es: 'Qué ocurrió', en: 'What happened' }, multiline: true },
]

const KEY = 'poligt:report'

export default function Report() {
  const { lang } = useLang()
  const [data, setData] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
  })
  const set = (k: string, v: string) => {
    const next = { ...data, [k]: v }
    setData(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }
  const clear = () => {
    setData({})
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  }
  const pdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`PoliGT - ${tr(UI.reportTitle, lang)}`, 14, 18)
    doc.setFontSize(11)
    let y = 30
    for (const f of FIELDS) {
      doc.setFont('helvetica', 'bold')
      doc.text(tr(f.label, lang), 14, y)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(data[f.key] || '-', 180)
      doc.text(lines, 14, y + 6)
      y += 6 + lines.length * 6 + 4
      if (y > 270) { doc.addPage(); y = 20 }
    }
    doc.setFontSize(8)
    doc.text(tr(UI.disclaimer, lang).slice(0, 120), 14, 288)
    doc.save('poligt-informe.pdf')
  }

  return (
    <div className="stack">
      <h1>📝 {tr(UI.reportTitle, lang)}</h1>
      <p className="lead">{tr(UI.reportHint, lang)}</p>
      {FIELDS.map((f) => (
        <label key={f.key} className="lbl">
          {tr(f.label, lang)}
          {f.multiline ? (
            <textarea className="field" rows={5} value={data[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
          ) : (
            <input className="field" value={data[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
          )}
        </label>
      ))}
      <button className="big" onClick={pdf}>📄 {tr(UI.makePdf, lang)}</button>
      <button className="btn danger" onClick={clear}>{tr(UI.clear, lang)}</button>
    </div>
  )
}
