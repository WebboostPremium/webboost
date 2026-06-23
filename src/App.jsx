import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'

const ServiciosPage = lazy(() => import('./pages/ServiciosPage'))
const PreciosPage = lazy(() => import('./pages/PreciosPage'))
const PortafolioPage = lazy(() => import('./pages/PortafolioPage'))
const NosotrosPage = lazy(() => import('./pages/NosotrosPage'))
const AfiliadosPage = lazy(() => import('./pages/AfiliadosPage'))
const ContactoPage = lazy(() => import('./pages/ContactoPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))

function PageFallback() {
  return <div className="min-h-[50vh]" aria-hidden="true" />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="servicios"
              element={<Suspense fallback={<PageFallback />}><ServiciosPage /></Suspense>}
            />
            <Route
              path="precios"
              element={<Suspense fallback={<PageFallback />}><PreciosPage /></Suspense>}
            />
            <Route
              path="portafolio"
              element={<Suspense fallback={<PageFallback />}><PortafolioPage /></Suspense>}
            />
            <Route
              path="nosotros"
              element={<Suspense fallback={<PageFallback />}><NosotrosPage /></Suspense>}
            />
            <Route
              path="afiliados"
              element={<Suspense fallback={<PageFallback />}><AfiliadosPage /></Suspense>}
            />
            <Route
              path="contacto"
              element={<Suspense fallback={<PageFallback />}><ContactoPage /></Suspense>}
            />
            <Route
              path="registro"
              element={<Suspense fallback={<PageFallback />}><AuthPage mode="register" /></Suspense>}
            />
            <Route
              path="iniciar-sesion"
              element={<Suspense fallback={<PageFallback />}><AuthPage mode="login" /></Suspense>}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
