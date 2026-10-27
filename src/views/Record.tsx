import { useEffect, useRef, useState } from 'react'
import { UI, tr, useLang } from '../i18n'
import { deleteRecording, listRecordings, saveRecording, type Recording } from '../db'

export default function Record() {
  const { lang } = useLang()
  const [kind, setKind] = useState<'video' | 'audio'>('video')
  const [rec, setRec] = useState(false)
  const [err, setErr] = useState(false)
  const [items, setItems] = useState<Recording[]>([])
  const mr = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const preview = useRef<HTMLVideoElement>(null)

  const refresh = () => listRecordings().then(setItems).catch(() => setItems([]))
  useEffect(() => {
    refresh()
    return () => stream.current?.getTracks().forEach((t) => t.stop())
  }, [])

  const start = async () => {
    setErr(false)
    try {
      const s = await navigator.mediaDevices.getUserMedia(
        kind === 'video' ? { video: { facingMode: 'environment' }, audio: true } : { audio: true },
      )
      stream.current = s
      if (preview.current && kind === 'video') preview.current.srcObject = s
      const r = new MediaRecorder(s)
      const chunks: Blob[] = []
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      r.onstop = async () => {
        s.getTracks().forEach((t) => t.stop())
        if (preview.current) preview.current.srcObject = null
        const mime = r.mimeType || (kind === 'video' ? 'video/webm' : 'audio/webm')
        await saveRecording({ kind, mime, createdAt: Date.now(), blob: new Blob(chunks, { type: mime }) })
        refresh()
      }
      r.start(1000)
      mr.current = r
      setRec(true)
    } catch {
      setErr(true)
    }
  }
  const stop = () => {
    mr.current?.stop()
    setRec(false)
  }

  return (
    <div className="stack">
      <h1>🎥 {tr(UI.record, lang)}</h1>
      <p className="lead">{tr(UI.recNote, lang)}</p>
      <div className="seg">
        <button disabled={rec} className={kind === 'video' ? 'on' : ''} onClick={() => setKind('video')}>{tr(UI.recVideo, lang)}</button>
        <button disabled={rec} className={kind === 'audio' ? 'on' : ''} onClick={() => setKind('audio')}>{tr(UI.recAudio, lang)}</button>
      </div>
      <video ref={preview} className={rec && kind === 'video' ? 'preview' : 'hidden'} autoPlay muted playsInline />
      {err && <p className="error">{tr(UI.recDenied, lang)}</p>}
      <button className={`big ${rec ? 'stop' : ''}`} onClick={rec ? stop : start}>
        {rec ? `⏹ ${tr(UI.recStop, lang)}` : `⏺ ${tr(UI.recStart, lang)}`}
      </button>
      <h2>{tr(UI.recSaved, lang)}</h2>
      {items.length === 0 && <p className="muted">{tr(UI.recEmpty, lang)}</p>}
      {[...items].reverse().map((r) => {
        const url = URL.createObjectURL(r.blob)
        const ext = r.mime.includes('mp4') ? 'mp4' : 'webm'
        return (
          <div key={r.id} className="panel">
            <p className="small muted">{new Date(r.createdAt).toLocaleString(lang === 'es' ? 'es-GT' : 'en-US')}</p>
            {r.kind === 'video' ? <video src={url} controls playsInline /> : <audio src={url} controls />}
            <div className="row">
              <a className="btn" href={url} download={`poligt-${r.createdAt}.${ext}`}>{tr(UI.download, lang)}</a>
              <button className="btn danger" onClick={() => deleteRecording(r.id!).then(refresh)}>{tr(UI.delete, lang)}</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
