import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'

const ServiciosPage = lazy(() => import('./pages/ServiciosPage'))
const PreciosPage = lazy(() => import('./pages/PreciosPage'))
const PortafolioPage = lazy(() => import('./pages/PortafolioPage'))
const NosotrosPage = lazy(() => import('./pages/NosotrosPage'))
const AfiliadosPage = lazy(() => import('./pages/AfiliadosPage'))
const ContactoPage = lazy(() => import('./pages/ContactoPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

const UserDashboardPage = lazy(() => import('./pages/dashboard/UserDashboardPage'))
const UserSitePage = lazy(() => import('./pages/dashboard/UserSitePage'))
const UserNotificationsPage = lazy(() => import('./pages/dashboard/UserNotificationsPage'))

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminSitesPage = lazy(() => import('./pages/admin/AdminSitesPage'))
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'))
const AdminBlogEditorPage = lazy(() => import('./pages/admin/AdminBlogEditorPage'))
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'))

function PageFallback() {
  return <div className="min-h-[50vh]" aria-hidden="true" />
}

function Lazy({ children }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="servicios" element={<Lazy><ServiciosPage /></Lazy>} />
            <Route path="precios" element={<Lazy><PreciosPage /></Lazy>} />
            <Route path="portafolio" element={<Lazy><PortafolioPage /></Lazy>} />
            <Route path="nosotros" element={<Lazy><NosotrosPage /></Lazy>} />
            <Route path="afiliados" element={<Lazy><AfiliadosPage /></Lazy>} />
            <Route path="contacto" element={<Lazy><ContactoPage /></Lazy>} />
            <Route path="registro" element={<Lazy><AuthPage mode="register" /></Lazy>} />
            <Route path="iniciar-sesion" element={<Lazy><AuthPage mode="login" /></Lazy>} />
          </Route>

          <Route path="recuperar-contrasena" element={<Lazy><ForgotPasswordPage /></Lazy>} />
          <Route path="blog" element={<Lazy><BlogPage /></Lazy>} />
          <Route path="blog/:slug" element={<Lazy><BlogPostPage /></Lazy>} />

          <Route path="panel" element={<ProtectedRoute><Lazy><UserDashboardPage /></Lazy></ProtectedRoute>} />
          <Route path="panel/sitio" element={<ProtectedRoute><Lazy><UserSitePage /></Lazy></ProtectedRoute>} />
          <Route path="panel/notificaciones" element={<ProtectedRoute><Lazy><UserNotificationsPage /></Lazy></ProtectedRoute>} />

          <Route path="admin" element={<AdminRoute><Lazy><AdminDashboardPage /></Lazy></AdminRoute>} />
          <Route path="admin/usuarios" element={<AdminRoute><Lazy><AdminUsersPage /></Lazy></AdminRoute>} />
          <Route path="admin/sitios" element={<AdminRoute><Lazy><AdminSitesPage /></Lazy></AdminRoute>} />
          <Route path="admin/blog" element={<AdminRoute><Lazy><AdminBlogPage /></Lazy></AdminRoute>} />
          <Route path="admin/blog/:id" element={<AdminRoute><Lazy><AdminBlogEditorPage /></Lazy></AdminRoute>} />
          <Route path="admin/notificaciones" element={<AdminRoute><Lazy><AdminNotificationsPage /></Lazy></AdminRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
