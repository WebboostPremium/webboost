'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { listAllCommissions, updateCommissionStatus } from '@/lib/expansion/commissions'
import { sendNotification } from '@/lib/expansion/notifications'
import type { Commission } from '@/types/expansion'

export default function AdminComisionesPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Commission[]>([])

  function load() { listAllCommissions().then(setItems) }
  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: Commission['status'], affiliateId: string, amount: number) {
    await updateCommissionStatus(id, status)
    if (status === 'pagada') {
      await sendNotification({
        userId: affiliateId,
        type: 'commission_paid',
        title: 'Comisión pagada',
        body: `Se pagó tu comisión de $${amount.toFixed(2)}`,
        link: '/afiliado/dashboard/comisiones',
      })
    }
    toast(`Comisión ${status}`, 'success')
    load()
  }

  const pending = items.filter((c) => c.status === 'pendiente' || c.status === 'aprobada')
  const paid = items.filter((c) => c.status === 'pagada')

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Gestión de comisiones</h1>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5"><p className="text-2xl font-bold">{pending.length}</p><p className="text-sm">Pendientes</p></div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5"><p className="text-2xl font-bold">{paid.length}</p><p className="text-sm">Pagadas</p></div>
      </div>
      <ul className="mt-8 space-y-2">
        {items.map((c) => (
          <li key={c.id} className="rounded-xl bg-white border px-4 py-3 flex flex-wrap justify-between gap-2 text-sm items-center">
            <span>${c.commissionAmount.toFixed(2)} ({c.commissionPercent}%)</span>
            <span className="capitalize text-slate-500">{c.status}</span>
            <div className="flex gap-2">
              {c.status === 'pendiente' && <button type="button" onClick={() => setStatus(c.id, 'aprobada', c.affiliateId, c.commissionAmount)} className="text-xs text-electric font-semibold">Aprobar</button>}
              {c.status === 'aprobada' && <button type="button" onClick={() => setStatus(c.id, 'pagada', c.affiliateId, c.commissionAmount)} className="text-xs text-emerald-600 font-semibold">Marcar pagada</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
