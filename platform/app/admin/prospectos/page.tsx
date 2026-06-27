'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { listAllProspects } from '@/lib/expansion/prospects'
import { PROSPECT_STATUSES } from '@/lib/constants/expansion'
import type { Prospect } from '@/types/expansion'

export default function AdminProspectosPage() {
  const { toast } = useToast()
  const [prospects, setProspects] = useState<Prospect[]>([])

  useEffect(() => { listAllProspects().then(setProspects) }, [])

  async function convert(prospectId: string, projectValue: number) {
    const res = await fetch(`/api/expansion/prospects/${prospectId}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectValue, commissionPercent: 10 }),
    })
    if (res.ok) {
      toast('Prospecto convertido: cliente, proyecto y comisión creados', 'success')
      listAllProspects().then(setProspects)
    } else {
      toast('Error en conversión', 'error')
    }
  }

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Gestión de prospectos</h1>
      <div className="mt-8 space-y-3">
        {prospects.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border p-5 flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-bold">{p.companyName}</p>
              <p className="text-sm text-slate-500">Afiliado: {p.affiliateId.slice(0, 8)}… · {p.contactName}</p>
              <p className="text-xs text-slate-400 capitalize mt-1">{p.status.replace(/_/g, ' ')}</p>
            </div>
            {p.status !== 'venta_cerrada' && p.status !== 'proyecto_iniciado' && (
              <button type="button" onClick={() => convert(p.id, p.estimatedBudget || 500)} className="btn-cta text-sm">
                Cerrar venta
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
