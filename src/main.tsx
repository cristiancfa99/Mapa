import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'

function showFatalError(msg: string) {
  document.body.style.cssText = 'margin:0;padding:24px;font-family:monospace;background:#fff;color:#c00'
  document.body.innerHTML = `<h2>Error al cargar</h2><pre style="white-space:pre-wrap;font-size:13px;margin-top:12px">${msg}</pre>`
}

window.onerror = (_msg, _src, _line, _col, err) => {
  showFatalError(String(err?.stack ?? err ?? _msg))
  return true
}

window.addEventListener('unhandledrejection', e => {
  showFatalError(String(e.reason?.stack ?? e.reason))
})

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', background: '#fff', color: '#c00' }}>
          <h2>Error en React</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12, fontSize: 13 }}>
            {this.state.error.message}{'\n'}{this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

async function main() {
  try {
    const { default: App } = await import('./App.tsx')
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
  } catch (e) {
    showFatalError(String((e as Error)?.stack ?? e))
  }
}

main()
