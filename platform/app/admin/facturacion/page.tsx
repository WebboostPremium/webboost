'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { listAllPayments, paymentStatusLabel, paymentTypeLabel } from '@/lib/expansion/payments'
import type { Payment } from '@/types'

export default function AdminFacturacionPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [confirming, setConfirming] = useState<string | null>(null)

  function load() {
    listAllPayments().then(setPayments)
  }

  useEffect(() => { load() }, [])

  async function confirmPayment(id: string) {
    setConfirming(id)
    try {
      const res = await fetch(`/api/admin/payments/${id}/confirm`, { method: 'POST' })
      if (!res.ok) throw new Error()
      toast('Pago confirmado', 'success')
      load()
    } catch {
      toast('Error al confirmar', 'error')
    } finally {
      setConfirming(null)
    }
  }

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Facturación</h1>
      <p className="text-slate-500 mt-1">Transacciones, pagos Wompi y confirmaciones manuales.</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <p className="text-2xl font-extrabold text-emerald-600">${totalPaid.toFixed(2)}</p>
          <p className="text-sm text-slate-500">Total cobrado</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <p className="text-2xl font-extrabold text-amber-600">${totalPending.toFixed(2)}</p>
          <p className="text-sm text-slate-500">Pendiente de cobro</p>
        </div>
      </div>

      <ul className="mt-8 space-y-2">
        {!payments.length ? (
          <li className="text-slate-500">No hay transacciones registradas.</li>
        ) : payments.map((p) => (
          <li key={p.id} className="rounded-xl bg-white border border-slate-100 px-4 py-4 flex flex-wrap justify-between gap-3 items-center">
            <div>
              <p className="font-semibold">{p.description || paymentTypeLabel(p.type)}</p>
              <p className="text-sm text-slate-500">{p.clientEmail || p.clientId || '—'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-bold">${p.amount} {p.currency}</p>
                <p className={`text-xs capitalize ${p.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {paymentStatusLabel(p.status)}
                </p>
              </div>
              {p.status === 'pending' && (
                <button
                  type="button"
                  disabled={confirming === p.id}
                  onClick={() => confirmPayment(p.id)}
                  className="btn-cta text-xs py-2 px-3 disabled:opacity-60"
                >
                  {confirming === p.id ? '...' : 'Confirmar'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
