import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('WebBooost render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>No se pudo cargar la página</h1>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            Recarga la página. Si el problema continúa, escríbenos por WhatsApp.
          </p>
          <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, overflow: 'auto', fontSize: 12 }}>
            {this.state.error.message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
