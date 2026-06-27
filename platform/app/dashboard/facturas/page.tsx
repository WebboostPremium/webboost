'use client'

import { useEffect, useState } from 'react'
import { Receipt, ExternalLink } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { listClientPayments, paymentStatusLabel, paymentTypeLabel } from '@/lib/expansion/payments'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Payment } from '@/types'

export default function FacturasPage() {
  const { user, profile } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    if (!user) return
    listClientPayments(user.uid, profile?.email).then(setPayments)
  }, [user, profile?.email])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Facturas</h1>
      <p className="text-slate-500 mt-1">Historial de pagos y comprobantes.</p>

      {!payments.length ? (
        <div className="mt-8">
          <EmptyState icon={Receipt} title="Sin facturas" description="Cuando realices un pago (demo, setup o mensualidad), aparecerá aquí." />
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {payments.map((p) => (
            <li key={p.id} className="rounded-xl bg-white border border-slate-100 px-4 py-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-ink">{p.description || paymentTypeLabel(p.type)}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {paymentTypeLabel(p.type)} · {new Date(
                      (p.createdAt as { seconds?: number })?.seconds
                        ? (p.createdAt as { seconds: number }).seconds * 1000
                        : p.createdAt as Date,
                    ).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-ink">${p.amount} {p.currency}</p>
                  <span className={`text-xs font-medium capitalize ${
                    p.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {paymentStatusLabel(p.status)}
                  </span>
                </div>
              </div>
              {p.wompiLink && p.status === 'pending' && (
                <a href={p.wompiLink} target="_blank" rel="noopener noreferrer" className="text-sm text-electric font-semibold mt-3 inline-flex items-center gap-1">
                  Completar pago <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
