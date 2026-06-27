'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useAuth } from '@/contexts/AuthProvider'

interface LinkItem {
  href: string
  label: string
}

export function DashboardShell({
  title,
  links,
  children,
}: {
  title: string
  links: LinkItem[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, profile } = useAuth()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-100 fixed inset-y-0 left-0">
        <div className="p-5 border-b border-slate-100">
          <Logo />
          <p className="text-xs text-slate-400 mt-2">{title}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === l.href ? 'bg-electric/10 text-electric' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 truncate mb-2">{profile?.name || profile?.email}</p>
          <Link href="/" className="text-xs text-electric hover:underline block mb-2">← Volver al sitio</Link>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-ink">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 p-5 md:p-8 max-w-6xl">{children}</main>
    </div>
  )
}
