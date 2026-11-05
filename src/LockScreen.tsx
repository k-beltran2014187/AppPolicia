import { useEffect, useState } from 'react'
import { UI, tr, useLang, type L } from './i18n'
import { Icon } from './icons'
import { checkPin, hasPin } from './privacy'
import { hasBio, unlockBio } from './biometric'

const T = {
  bio: { es: 'Entrar con rostro o huella', en: 'Sign in with face or fingerprint' },
  bioFail: { es: 'No se pudo verificar. Intenta de nuevo.', en: 'Could not verify. Try again.' },
  password: { es: 'Entrar con mi contraseña', en: 'Sign in with my password' },
} satisfies Record<string, L>

/** onFallback: salir de la sesión para volver a entrar con contraseña (solo si hay una cuenta abierta). */
export default function LockScreen({ onUnlock, onFallback }: { onUnlock: () => void; onFallback?: () => void }) {
  const { lang } = useLang()
  const [pin, setPin] = useState('')
  const [bad, setBad] = useState(false)
  const [bioBad, setBioBad] = useState(false)
  const bio = hasBio()
  const pinOn = hasPin()

  const tryBio = async () => {
    setBioBad(false)
    if (await unlockBio()) onUnlock()
    else setBioBad(true)
  }
  // Al abrir la app se pide rostro/huella solo; si el navegador lo bloquea, queda el botón.
  useEffect(() => { if (hasBio()) void unlockBio().then((ok) => ok && onUnlock()) }, [onUnlock])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await checkPin(pin)) onUnlock()
    else { setBad(true); setPin('') }
  }

  return (
    <div className="modal lock" role="dialog" aria-modal="true" aria-labelledby="lock-title">
      <form className="modal-box" onSubmit={submit}>
        <span className="ico-circle big-ico"><Icon name="lock" size={26} /></span>
        <h2 id="lock-title">{tr(UI.locked, lang)}</h2>
        {bio && <button type="button" className="big" onClick={tryBio} autoFocus={!pinOn}>{tr(T.bio, lang)}</button>}
        {bioBad && <p className="error" role="alert">{tr(T.bioFail, lang)}</p>}
        {pinOn && (
          <>
            <input
              className="field pin-field"
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus={!bio}
              autoComplete="off"
              aria-label={tr(UI.pinEnter, lang)}
              placeholder={tr(UI.pinEnter, lang)}
              value={pin}
              onChange={(e) => { setBad(false); setPin(e.target.value.replace(/\D/g, '')) }}
            />
            {bad && <p className="error" role="alert">{tr(UI.pinWrong, lang)}</p>}
            <button className={bio ? 'btn' : 'big'} type="submit" disabled={pin.length !== 4}>{tr(UI.unlock, lang)}</button>
          </>
        )}
        {bio && onFallback && <button type="button" className="linklike" onClick={onFallback}>{tr(T.password, lang)}</button>}
      </form>
    </div>
  )
}