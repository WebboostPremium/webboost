'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { getProspect, getProspectHistory, logFollowUp } from '@/lib/expansion/prospects'
import { FOLLOW_UP_ACTIONS } from '@/lib/constants/expansion'
import type { FollowUpActionType, Prospect } from '@/types/expansion'

export default function ProspectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [history, setHistory] = useState<Awaited<ReturnType<typeof getProspectHistory>>>([])

  useEffect(() => {
    if (!id) return
    getProspect(id).then(setProspect)
    getProspectHistory(id).then(setHistory)
  }, [id])

  async function addFollowUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user || !id) return
    const fd = new FormData(e.currentTarget)
    await logFollowUp(
      id,
      fd.get('actionType') as FollowUpActionType,
      user.uid,
      profile?.name || user.email || '',
      fd.get('comment') as string,
    )
    toast('Seguimiento registrado', 'success')
    getProspectHistory(id).then(setHistory)
    e.currentTarget.reset()
  }

  if (!prospect) return <p className="text-slate-500">Cargando...</p>

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">{prospect.companyName}</h1>
      <p className="text-slate-500 mt-1">{prospect.contactName} · {prospect.email}</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-white border border-slate-100 p-6 space-y-2 text-sm">
          <p><strong>Teléfono:</strong> {prospect.phone}</p>
          <p><strong>WhatsApp:</strong> {prospect.whatsapp}</p>
          <p><strong>Servicio:</strong> {prospect.serviceInterest}</p>
          <p><strong>Presupuesto:</strong> {prospect.estimatedBudget ? `$${prospect.estimatedBudget}` : '—'}</p>
          <p><strong>Interés:</strong> {prospect.interestLevel}</p>
          {prospect.notes && <p><strong>Notas:</strong> {prospect.notes}</p>}
        </div>

        <form onSubmit={addFollowUp} className="rounded-2xl bg-white border border-slate-100 p-6 space-y-3">
          <h2 className="font-bold text-ink">Registrar seguimiento</h2>
          <select required name="actionType" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {FOLLOW_UP_ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
          <textarea required name="comment" placeholder="Comentario" rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <button type="submit" className="btn-cta w-full text-sm">Guardar en bitácora</button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-ink mb-4">Historial permanente</h2>
        <ul className="space-y-2">
          {history.map((h) => (
            <li key={h.id} className="rounded-xl bg-white border border-slate-100 px-4 py-3 text-sm">
              <p className="font-semibold capitalize">{(h.actionType as string).replace(/_/g, ' ')}</p>
              <p className="text-slate-600 mt-1">{h.comment}</p>
              <p className="text-xs text-slate-400 mt-1">{h.userName}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
