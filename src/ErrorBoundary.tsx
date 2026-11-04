import { Component, type ReactNode } from 'react'
import { UI, type Lang } from './i18n'

/** Catches render errors so a bug in one screen never leaves a blank page. */
export default class ErrorBoundary extends Component<{ lang: Lang; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    const { lang } = this.props
    return (
      <div className="panel stack" role="alert">
        <h1>{UI.errTitle[lang]}</h1>
        <p>{UI.errBody[lang]}</p>
        <button className="big" onClick={() => window.location.reload()}>{UI.reload[lang]}</button>
      </div>
    )
  }
}
