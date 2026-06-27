'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Users, TrendingUp, DollarSign, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { listProspectsByAffiliate, computeAffiliateStats } from '@/lib/expansion/prospects'
import { listCommissionsByAffiliate, computeCommissionTotals } from '@/lib/expansion/commissions'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { Prospect, Commission } from '@/types/expansion'

export default function EstadisticasPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])

  useEffect(() => {
    if (!user) return
    Promise.all([
      listProspectsByAffiliate(user.uid),
      listCommissionsByAffiliate(user.uid),
    ]).then(([p, c]) => {
      setProspects(p)
      setCommissions(c)
      setLoading(false)
    })
  }, [user])

  const stats = computeAffiliateStats(prospects)
  const comm = computeCommissionTotals(commissions)

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const byStatus = prospects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})

  const cards = [
    { label: 'Total prospectos', value: stats.total, icon: Users },
    { label: 'Tasa de conversión', value: `${stats.conversion}%`, icon: TrendingUp },
    { label: 'Ventas cerradas', value: stats.closed, icon: Target },
    { label: 'Comisiones pagadas', value: `$${comm.paidAmount.toFixed(0)}`, icon: DollarSign },
    { label: 'Comisiones pendientes', value: `$${comm.pendingAmount.toFixed(0)}`, icon: DollarSign },
    { label: 'Pipeline activo', value: stats.total - stats.closed, icon: BarChart3 },
  ]

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Estadísticas</h1>
      <p className="text-slate-500 mt-1">Métricas de rendimiento comercial.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-white border border-slate-100 p-5">
            <Icon className="w-7 h-7 text-electric mb-2" />
            <p className="text-2xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-slate-100 p-6">
        <h2 className="font-bold text-ink mb-4">Prospectos por estado</h2>
        <ul className="space-y-2">
          {Object.entries(byStatus).map(([status, count]) => (
            <li key={status} className="flex justify-between text-sm py-2 border-b border-slate-50 last:border-0">
              <span className="capitalize">{status.replace(/_/g, ' ')}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
