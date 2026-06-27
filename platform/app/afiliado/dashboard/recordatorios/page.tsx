'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { listUserReminders, createReminder, completeReminder } from '@/lib/expansion/reminders'
import { sendNotification } from '@/lib/expansion/notifications'
import type { Reminder } from '@/types/expansion'

export default function RecordatoriosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<Reminder[]>([])

  function load() {
    if (!user) return
    listUserReminders(user.uid, true).then(setItems)
  }

  useEffect(() => { load() }, [user])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const fd = new FormData(e.currentTarget)
    await createReminder({
      userId: user.uid,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      type: fd.get('type') as Reminder['type'],
      dueAt: fd.get('dueAt') as string,
    })
    await sendNotification({
      userId: user.uid,
      type: 'reminder',
      title: 'Recordatorio programado',
      body: fd.get('title') as string,
    })
    toast('Recordatorio creado', 'success')
    load()
    e.currentTarget.reset()
  }

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Recordatorios</h1>
      <form onSubmit={handleCreate} className="rounded-2xl bg-white border p-6 mt-6 space-y-3 max-w-lg">
        <input required name="title" placeholder="Título" className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        <select name="type" className="w-full rounded-xl border px-4 py-2.5 text-sm">
          <option value="llamar">Llamar</option>
          <option value="propuesta">Enviar propuesta</option>
          <option value="reunion">Confirmar reunión</option>
          <option value="pago">Solicitar pago</option>
        </select>
        <input required type="datetime-local" name="dueAt" className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        <textarea name="description" placeholder="Notas" rows={2} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        <button type="submit" className="btn-cta w-full">Programar</button>
      </form>
      <ul className="mt-8 space-y-2">
        {items.map((r) => (
          <li key={r.id} className={`rounded-xl border px-4 py-3 flex justify-between text-sm ${r.completed ? 'opacity-50' : ''}`}>
            <span>{r.title}</span>
            {!r.completed && (
              <button type="button" onClick={async () => { await completeReminder(r.id); load() }} className="text-electric font-semibold text-xs">Completar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
