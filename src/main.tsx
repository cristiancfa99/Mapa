import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
