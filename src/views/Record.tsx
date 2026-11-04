import { useEffect, useMemo, useRef, useState } from 'react'
import { UI, tr, useLang } from '../i18n'
import { Icon } from '../icons'
import { beginRecording, deleteRecording, finishRecording, listRecordings, recoverInterrupted, saveChunk, type Recording } from '../db'

const VIDEO_TYPES = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
const AUDIO_TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']

const pickMime = (kind: 'video' | 'audio') =>
  (kind === 'video' ? VIDEO_TYPES : AUDIO_TYPES).find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) ?? ''

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/** One saved recording. The object URL is created once and released on unmount (it used to leak on every render). */
function Item({ r, onDelete }: { r: Recording; onDelete: () => void }) {
  const { lang } = useLang()
  const url = useMemo(() => URL.createObjectURL(r.blob), [r.blob])
  useEffect(() => () => URL.revokeObjectURL(url), [url])
  const ext = r.kind === 'photo' ? (r.mime.includes('png') ? 'png' : 'jpg') : r.mime.includes('mp4') ? 'mp4' : 'webm'
  return (
    <div className="panel">
      <p className="small muted">{new Date(r.createdAt).toLocaleString(lang === 'es' ? 'es-GT' : 'en-US')} · {(r.blob.size / 1_048_576).toFixed(1)} MB</p>
      {r.kind === 'video' ? <video src={url} controls playsInline preload="metadata" /> : r.kind === 'photo' ? <img className="photo" src={url} alt="" /> : <audio src={url} controls preload="metadata" />}
      <div className="row">
        <a className="btn" href={url} download={`poligt-${r.createdAt}.${ext}`}><Icon name="download" size={18} /> {tr(UI.download, lang)}</a>
        <button className="btn danger" onClick={onDelete}>{tr(UI.delete, lang)}</button>
      </div>
    </div>
  )
}

export default function Record() {
  const { lang } = useLang()
  const [kind, setKind] = useState<'video' | 'audio'>('video')
  const [rec, setRec] = useState(false)
  const [secs, setSecs] = useState(0)
  const [err, setErr] = useState<'denied' | 'unsupported' | 'full' | null>(null)
  const [recovered, setRecovered] = useState(false)
  const [items, setItems] = useState<Recording[]>([])
  const mr = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const preview = useRef<HTMLVideoElement>(null)
  const wake = useRef<{ release: () => Promise<void> } | null>(null)

  const refresh = () => listRecordings().then(setItems).catch(() => setItems([]))

  useEffect(() => {
    recoverInterrupted()
      .then((n) => setRecovered(n > 0))
      .catch(() => {})
      .finally(refresh)
    // Ask the browser not to evict recordings under storage pressure.
    navigator.storage?.persist?.().catch(() => {})
    return () => {
      // Leaving the page while recording: finish cleanly so nothing is lost.
      if (mr.current && mr.current.state !== 'inactive') mr.current.stop()
      stream.current?.getTracks().forEach((t) => t.stop())
      wake.current?.release().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!rec) return
    const t = window.setInterval(() => setSecs((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [rec])

  const start = async () => {
    setErr(null)
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) return setErr('unsupported')
    try {
      const s = await navigator.mediaDevices.getUserMedia(
        kind === 'video' ? { video: { facingMode: 'environment' }, audio: true } : { audio: true },
      )
      stream.current = s
      if (preview.current && kind === 'video') preview.current.srcObject = s
      const mime = pickMime(kind)
      const r = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s)
      const finalMime = r.mimeType || mime || (kind === 'video' ? 'video/webm' : 'audio/webm')
      const id = await beginRecording(kind, finalMime)
      let seq = 0
      let queue: Promise<unknown> = Promise.resolve()
      r.ondataavailable = (e) => {
        if (!e.data.size) return
        const n = seq++
        // Chunks are written in order while recording; a failure (full disk) stops cleanly.
        queue = queue.then(() => saveChunk(id, n, e.data)).catch(() => {
          setErr('full')
          if (r.state !== 'inactive') r.stop()
        })
      }
      r.onstop = async () => {
        s.getTracks().forEach((t) => t.stop())
        if (preview.current) preview.current.srcObject = null
        await queue
        await finishRecording(id).catch(() => {})
        await wake.current?.release().catch(() => {})
        wake.current = null
        setRec(false)
        refresh()
      }
      r.start(1000)
      mr.current = r
      setSecs(0)
      setRec(true)
      try {
        // Keep the screen on while recording (where supported).
        wake.current = await (navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock?.request('screen') ?? null
      } catch { /* optional */ }
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop())
      setErr('denied')
    }
  }
  const stop = () => {
    if (mr.current && mr.current.state !== 'inactive') mr.current.stop()
  }

  const errText = err === 'unsupported' ? UI.recUnsupported : err === 'full' ? UI.recFull : UI.recDenied

  return (
    <div className="stack">
      <h1>{tr(UI.record, lang)}</h1>
      <p className="lead">{tr(UI.recNote, lang)}</p>
      {recovered && <p className="panel ok small">{tr(UI.recRecovered, lang)}</p>}
      <div className="seg">
        <button disabled={rec} className={kind === 'video' ? 'on' : ''} onClick={() => setKind('video')} aria-pressed={kind === 'video'}>{tr(UI.recVideo, lang)}</button>
        <button disabled={rec} className={kind === 'audio' ? 'on' : ''} onClick={() => setKind('audio')} aria-pressed={kind === 'audio'}>{tr(UI.recAudio, lang)}</button>
      </div>
      <video ref={preview} className={rec && kind === 'video' ? 'preview' : 'hidden'} autoPlay muted playsInline />
      {rec && <p className="rec-timer" role="timer" aria-live="off"><span className="rec-dot" />{fmt(secs)}</p>}
      {err && <p className="error" role="alert">{tr(errText, lang)}</p>}
      <button className={`big ${rec ? 'stop' : ''}`} onClick={rec ? stop : start}>
        {rec ? <><Icon name="stop" size={20} fill="currentColor" /> {tr(UI.recStop, lang)}</> : <><Icon name="rec" size={20} fill="currentColor" /> {tr(UI.recStart, lang)}</>}
      </button>
      <h2>{tr(UI.recSaved, lang)}</h2>
      {items.length === 0 && <p className="muted">{tr(UI.recEmpty, lang)}</p>}
      {[...items].reverse().map((r) => (
        <Item key={r.id} r={r} onDelete={() => deleteRecording(r.id!).then(refresh)} />
      ))}
    </div>
  )
}
