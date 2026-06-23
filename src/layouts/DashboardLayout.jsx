import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Globe, Bell, LogOut, Home, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive ? 'bg-electric/10 text-electric' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function DashboardLayout({ children, variant = 'user' }) {
  const { user, profile, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const userLinks = [
    { to: '/panel', label: 'Inicio', icon: LayoutDashboard, end: true },
    { to: '/panel/sitio', label: 'Mi sitio web', icon: Globe },
    { to: '/panel/notificaciones', label: 'Notificaciones', icon: Bell },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Resumen', icon: Shield, end: true },
    { to: '/admin/usuarios', label: 'Usuarios', icon: LayoutDashboard },
    { to: '/admin/sitios', label: 'Sitios web', icon: Globe },
    { to: '/admin/blog', label: 'Blog', icon: Home },
    { to: '/admin/notificaciones', label: 'Enviar avisos', icon: Bell },
  ]

  const links = variant === 'admin' ? adminLinks : userLinks
  const base = variant === 'admin' ? '/admin' : '/panel'

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-100 fixed inset-y-0 left-0">
        <div className="p-5 border-b border-slate-100">
          <Logo />
          <p className="text-xs text-slate-400 mt-2">
            {variant === 'admin' ? 'Panel de administración' : 'Tu panel'}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
          {variant === 'user' && isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              <Shield className="w-4 h-4" />
              Administración
            </NavLink>
          )}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 truncate mb-2">{profile?.displayName || user?.email}</p>
          <Link to="/" className="text-xs text-electric hover:underline block mb-2">← Volver al sitio</Link>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-ink">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <Logo />
          <Link to={base} className="text-sm text-electric font-medium">Panel</Link>
        </header>
        <main className="p-5 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}
