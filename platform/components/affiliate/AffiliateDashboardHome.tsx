'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users, TrendingUp, DollarSign, Target, Copy, Check,
  Bell, MessageSquarePlus, BarChart3, BookOpen,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { SkeletonCard } from '@/components/ui/Skeleton'
import {
  getAffiliateByUserId,
  getAffiliateDashboardStats,
  buildReferralLink,
} from '@/lib/expansion/affiliates'
import { listProspectsByAffiliate } from '@/lib/expansion/prospects'
import { listCommissionsByAffiliate } from '@/lib/expansion/commissions'
import { listUserReminders } from '@/lib/expansion/reminders'
import { getUserNotifications } from '@/lib/expansion/notifications'
import type { Affiliate } from '@/types'
import type { Prospect, Commission } from '@/types/expansion'

export function AffiliateDashboardHome() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAffiliateDashboardStats>> | null>(null)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [reminders, setReminders] = useState<Awaited<ReturnType<typeof listUserReminders>>>([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getAffiliateByUserId(user.uid),
      getAffiliateDashboardStats(user.uid),
      listProspectsByAffiliate(user.uid),
      listCommissionsByAffiliate(user.uid),
      listUserReminders(user.uid),
      getUserNotifications(user.uid),
    ]).then(([aff, st, p, c, r, n]) => {
      setAffiliate(aff)
      setStats(st)
      setProspects(p)
      setCommissions(c)
      setReminders(r.filter((x) => !x.completed).slice(0, 4))
      setUnreadNotifs(n.filter((x) => !x.read).length)
      setLoading(false)
    })
  }, [user])

  async function copyReferralLink() {
    if (!affiliate?.code) return
    await navigator.clipboard.writeText(buildReferralLink(affiliate.code))
    setCopied(true)
    toast('Enlace copiado al portapapeles', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  const firstName = profile?.name?.split(' ')[0] || 'Afiliado'

  const kpiCards = stats ? [
    { label: 'Prospectos', value: stats.prospects, icon: Users, href: '/afiliado/dashboard/prospectos' },
    { label: 'Conversión', value: `${stats.conversion}%`, icon: TrendingUp, href: '/afiliado/dashboard/estadisticas' },
    { label: 'Comisiones pendientes', value: `$${stats.pendingCommission.toFixed(0)}`, icon: DollarSign, href: '/afiliado/dashboard/comisiones' },
    { label: 'Ventas cerradas', value: stats.closedSales, icon: Target, href: '/afiliado/dashboard/clientes' },
  ] : []

  const quickLinks = [
    { href: '/afiliado/dashboard/prospectos?new=1', label: 'Nuevo prospecto', icon: Users },
    { href: '/afiliado/dashboard/recordatorios', label: 'Recordatorios', icon: Bell },
    { href: '/afiliado/dashboard/material', label: 'Material de ventas', icon: BookOpen },
    { href: '/afiliado/dashboard/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ]

  return (
    <div>
      <div className="rounded-2xl brand-gradient p-6 md:p-8 text-white">
        <p className="text-white/70 text-sm">Panel de afiliado</p>
        <h1 className="heading-xl text-2xl md:text-3xl mt-1">Hola, {firstName}</h1>
        <p className="text-white/80 mt-2 text-sm max-w-xl">
          Gestiona prospectos, cierra ventas y haz seguimiento de tus comisiones desde un solo lugar.
        </p>
        {affiliate?.code && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
              <p className="text-xs text-white/70">Tu código de referido</p>
              <p className="font-mono font-bold text-lg tracking-wider">{affiliate.code}</p>
            </div>
            <button
              type="button"
              onClick={copyReferralLink}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-electric px-4 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar enlace'}
            </button>
          </div>
        )}
        {affiliate?.status === 'inactive' && (
          <p className="mt-4 text-amber-200 text-sm font-medium">
            Tu cuenta de afiliado está inactiva. Contacta al administrador.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {kpiCards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-electric/30 hover:shadow-sm transition-all"
          >
            <Icon className="w-7 h-7 text-electric mb-3" />
            <p className="text-2xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {quickLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Icon className="w-5 h-5 text-electric shrink-0" />
            {label}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-ink">Prospectos recientes</h2>
            <Link href="/afiliado/dashboard/prospectos" className="text-sm text-electric font-semibold">
              Ver todos
            </Link>
          </div>
          {!prospects.length ? (
            <p className="text-sm text-slate-500">Aún no tienes prospectos. ¡Registra el primero!</p>
          ) : (
            <ul className="space-y-2">
              {prospects.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/afiliado/dashboard/prospectos/${p.id}`}
                    className="flex justify-between items-center rounded-xl px-3 py-2.5 hover:bg-slate-50 text-sm"
                  >
                    <span className="font-medium text-ink">{p.companyName}</span>
                    <span className="text-xs capitalize text-slate-400">{p.status.replace(/_/g, ' ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-ink">Recordatorios</h2>
              <Link href="/afiliado/dashboard/recordatorios" className="text-sm text-electric font-semibold">
                Ver todos
              </Link>
            </div>
            {!reminders.length ? (
              <p className="text-sm text-slate-500">Sin recordatorios pendientes.</p>
            ) : (
              <ul className="space-y-2">
                {reminders.map((r) => (
                  <li key={r.id} className="text-sm py-2 border-b border-slate-50 last:border-0">
                    <span className="font-medium">{r.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-ink">Comisiones recientes</h2>
              <Link href="/afiliado/dashboard/comisiones" className="text-sm text-electric font-semibold">
                Ver todas
              </Link>
            </div>
            {!commissions.length ? (
              <p className="text-sm text-slate-500">Sin comisiones aún.</p>
            ) : (
              <ul className="space-y-2">
                {commissions.slice(0, 3).map((c) => (
                  <li key={c.id} className="flex justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 capitalize">{c.status}</span>
                    <span className="font-semibold text-electric">${c.commissionAmount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
            {unreadNotifs > 0 && (
              <p className="text-xs text-electric mt-3 font-medium">{unreadNotifs} notificación{unreadNotifs > 1 ? 'es' : ''} sin leer</p>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/afiliado/dashboard/prospectos?new=1"
        className="btn-cta mt-8 inline-flex items-center gap-2"
      >
        <MessageSquarePlus className="w-4 h-4" />
        Registrar nuevo prospecto
      </Link>
    </div>
  )
}
