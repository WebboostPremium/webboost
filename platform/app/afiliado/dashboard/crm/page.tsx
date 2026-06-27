'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthProvider'
import { listProspectsByAffiliate, computeAffiliateStats } from '@/lib/expansion/prospects'
import { listCommissionsByAffiliate, computeCommissionTotals } from '@/lib/expansion/commissions'
import { listUserReminders } from '@/lib/expansion/reminders'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { Prospect, Commission } from '@/types/expansion'

export default function CrmPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [reminders, setReminders] = useState<Awaited<ReturnType<typeof listUserReminders>>>([])

  useEffect(() => {
    if (!user) return
    Promise.all([
      listProspectsByAffiliate(user.uid),
      listCommissionsByAffiliate(user.uid),
      listUserReminders(user.uid),
    ]).then(([p, c, r]) => {
      setProspects(p)
      setCommissions(c)
      setReminders(r.slice(0, 5))
      setLoading(false)
    })
  }, [user])

  const stats = computeAffiliateStats(prospects)
  const comm = computeCommissionTotals(commissions)

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const cards = [
    { label: 'Prospectos activos', value: stats.total, icon: Users },
    { label: 'Conversión', value: `${stats.conversion}%`, icon: TrendingUp },
    { label: 'Comisiones pendientes', value: `$${comm.pendingAmount.toFixed(0)}`, icon: DollarSign },
    { label: 'Ventas cerradas', value: stats.closed, icon: Target },
  ]

  return (
    <div>
      <h1 className="heading-xl text-2xl md:text-3xl text-ink">CRM</h1>
      <p className="text-slate-500 mt-2">Vista general de tu pipeline comercial.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-white border border-slate-100 p-5">
            <Icon className="w-8 h-8 text-electric mb-3" />
            <p className="text-2xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-white border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-ink">Recordatorios</h2>
            <Link href="/afiliado/dashboard/recordatorios" className="text-sm text-electric font-semibold">Ver todos</Link>
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
            <h2 className="font-bold text-ink">Prospectos recientes</h2>
            <Link href="/afiliado/dashboard/prospectos" className="text-sm text-electric font-semibold">Ver todos</Link>
          </div>
          <ul className="space-y-2">
            {prospects.slice(0, 5).map((p) => (
              <li key={p.id} className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span>{p.companyName}</span>
                <span className="text-slate-400 capitalize">{p.status.replace(/_/g, ' ')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link href="/afiliado/dashboard/prospectos?new=1" className="btn-cta mt-8 inline-flex">
        + Nuevo prospecto
      </Link>
    </div>
  )
}
