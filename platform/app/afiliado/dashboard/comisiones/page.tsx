'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { listCommissionsByAffiliate, computeCommissionTotals } from '@/lib/expansion/commissions'
import type { Commission } from '@/types/expansion'

export default function ComisionesPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Commission[]>([])

  useEffect(() => {
    if (!user) return
    listCommissionsByAffiliate(user.uid).then(setItems)
  }, [user])

  const totals = computeCommissionTotals(items)

  return (
    <div>
      <h1 className="heading-xl text-2xl md:text-3xl text-ink">Mis comisiones</h1>
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="rounded-2xl bg-white border p-5"><p className="text-2xl font-bold">${totals.pendingAmount.toFixed(2)}</p><p className="text-sm text-slate-500">Pendientes</p></div>
        <div className="rounded-2xl bg-white border p-5"><p className="text-2xl font-bold">${totals.paidAmount.toFixed(2)}</p><p className="text-sm text-slate-500">Pagadas</p></div>
        <div className="rounded-2xl bg-white border p-5"><p className="text-2xl font-bold">${totals.totalGenerated.toFixed(2)}</p><p className="text-sm text-slate-500">Total generado</p></div>
      </div>
      <ul className="mt-8 space-y-2">
        {items.map((c) => (
          <li key={c.id} className="rounded-xl bg-white border border-slate-100 px-4 py-3 flex justify-between text-sm">
            <span>Proyecto ${c.projectValue}</span>
            <span className="font-semibold text-electric">${c.commissionAmount.toFixed(2)}</span>
            <span className="capitalize text-slate-500">{c.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
