import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS } from '../config/site'
import { useAuth } from '../context/AuthContext'

const navClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-slate-500 hover:text-ink'}`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function handleLogout() {
    await logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-6 h-20 flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 absolute left-1/2 -translate-x-1/2" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={isAdmin ? '/admin' : '/panel'} className="text-sm font-medium text-electric hover:underline">
                {isAdmin ? 'Admin' : 'Mi panel'}
              </Link>
              <span className="text-sm text-slate-500 max-w-[120px] truncate hidden lg:inline">
                {user.displayName || user.email}
              </span>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-ink flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </>
          ) : (
            <Link to="/iniciar-sesion" className="text-sm font-medium text-slate-500 hover:text-ink transition-colors">
              Iniciar sesión
            </Link>
          )}
          <Link to="/contacto" className="btn-outline border-slate-200">Solicitar demo</Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-white border-b border-slate-100 px-5 py-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-base font-medium text-slate-600"
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to={isAdmin ? '/admin' : '/panel'} onClick={() => setOpen(false)} className="py-2.5 text-base font-medium text-electric">
                  {isAdmin ? 'Panel admin' : 'Mi panel'}
                </Link>
                <button type="button" onClick={handleLogout} className="py-2.5 text-base font-medium text-slate-600 text-left">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/iniciar-sesion" onClick={() => setOpen(false)} className="py-2.5 text-base font-medium text-slate-600">
                Iniciar sesión
              </Link>
            )}
            <Link to="/contacto" onClick={() => setOpen(false)} className="btn-cta mt-3 w-full text-center">
              Solicitar demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
