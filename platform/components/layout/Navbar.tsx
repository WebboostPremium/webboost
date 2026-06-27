'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { NAV_LINKS } from '@/config/site'
import { useAuth } from '@/contexts/AuthProvider'
import { getRoleRedirect } from '@/lib/auth/session'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, profile, logout, isAdmin } = useAuth()
  const pathname = usePathname()

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
    window.location.href = '/'
  }

  const panelHref = profile ? getRoleRedirect(profile.role) : '/dashboard'

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
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${pathname === l.href ? 'text-ink' : 'text-slate-500 hover:text-ink'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href={panelHref} className="text-sm font-medium text-electric hover:underline">
                {isAdmin ? 'Admin' : 'Mi panel'}
              </Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-ink flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </>
          ) : (
            <Link href="/iniciar-sesion" className="text-sm font-medium text-slate-500 hover:text-ink transition-colors">
              Iniciar sesión
            </Link>
          )}
          <Link href="/demo" className="btn-outline border-slate-200">Solicitar demo</Link>
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
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2.5 text-base font-medium text-slate-600">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={panelHref} onClick={() => setOpen(false)} className="py-2.5 text-base font-medium text-electric">
                  {isAdmin ? 'Panel admin' : 'Mi panel'}
                </Link>
                <button type="button" onClick={handleLogout} className="py-2.5 text-base font-medium text-slate-600 text-left">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/iniciar-sesion" onClick={() => setOpen(false)} className="py-2.5 text-base font-medium text-slate-600">
                Iniciar sesión
              </Link>
            )}
            <Link href="/demo" onClick={() => setOpen(false)} className="btn-cta mt-3 w-full text-center">
              Solicitar demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
