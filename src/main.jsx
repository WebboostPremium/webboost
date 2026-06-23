import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const rootEl = document.getElementById('root')

if (!rootEl) {
  document.body.innerHTML = '<p style="padding:2rem;font-family:system-ui">Error: no se encontró #root</p>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (error) {
    console.error(error)
    rootEl.innerHTML = `<pre style="padding:2rem;font-family:monospace;white-space:pre-wrap">${error?.message ?? error}</pre>`
  }
}
