'use client'

import { useEffect, useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { listClientTickets, createTicket, updateTicketStatus } from '@/lib/expansion/tickets'
import { sendNotification } from '@/lib/expansion/notifications'
import { logAudit } from '@/lib/expansion/audit'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ClientTicket } from '@/types/expansion'

export default function SolicitudesPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<ClientTicket[]>([])
  const [showForm, setShowForm] = useState(false)

  function load() {
    if (!user) return
    listClientTickets(user.uid).then(setTickets)
  }

  useEffect(() => { load() }, [user])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const fd = new FormData(e.currentTarget)
    await createTicket({
      clientId: user.uid,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
    })
    await sendNotification({ userId: '__admins__', role: 'admin', type: 'ticket_created', title: 'Nuevo ticket', body: fd.get('title') as string, link: '/admin/solicitudes' })
    await logAudit({ userId: user.uid, userName: profile?.name || '', role: 'client', action: 'ticket_created', clientId: user.uid })
    toast('Solicitud enviada', 'success')
    setShowForm(false)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="heading-xl text-2xl text-ink">Centro de soporte</h1>
        <button type="button" onClick={() => setShowForm(!showForm)} className="btn-cta text-sm">Nueva solicitud</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl bg-white border p-6 mb-6 space-y-3">
          <input required name="title" placeholder="Asunto" className="w-full rounded-xl border px-4 py-2.5 text-sm" />
          <textarea required name="description" placeholder="Describe tu solicitud" rows={4} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
          <button type="submit" className="btn-cta">Enviar</button>
        </form>
      )}

      {!tickets.length ? (
        <EmptyState icon={MessageSquarePlus} title="Sin solicitudes" description="Crea un ticket para cambios, soporte o integraciones." />
      ) : (
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li key={t.id} className="rounded-xl bg-white border px-4 py-4">
              <div className="flex justify-between">
                <p className="font-semibold">{t.title}</p>
                <span className="text-xs capitalize text-slate-500">{t.status.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{t.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
