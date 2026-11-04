import { useState } from 'react'
import { UI, tr, useLang } from './i18n'
import { Icon } from './icons'
import { checkPin } from './privacy'

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { lang } = useLang()
  const [pin, setPin] = useState('')
  const [bad, setBad] = useState(false)

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
        <input
          className="field pin-field"
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          autoComplete="off"
          aria-label={tr(UI.pinEnter, lang)}
          placeholder={tr(UI.pinEnter, lang)}
          value={pin}
          onChange={(e) => { setBad(false); setPin(e.target.value.replace(/\D/g, '')) }}
        />
        {bad && <p className="error" role="alert">{tr(UI.pinWrong, lang)}</p>}
        <button className="big" type="submit" disabled={pin.length !== 4}>{tr(UI.unlock, lang)}</button>
      </form>
    </div>
  )
}
