'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { getUserNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/expansion/notifications'
import type { AppNotification } from '@/types/expansion'

export default function NotificacionesPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<AppNotification[]>([])

  useEffect(() => {
    if (!user) return
    getUserNotifications(user.uid).then(setItems)
  }, [user])

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="heading-xl text-2xl text-ink">Notificaciones</h1>
        {items.some((n) => !n.read) && (
          <button type="button" onClick={async () => { if (user) { await markAllNotificationsRead(user.uid); getUserNotifications(user.uid).then(setItems) } }} className="btn-outline text-sm">
            Marcar todas leídas
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className={`rounded-xl border px-4 py-3 text-sm ${n.read ? 'bg-white' : 'bg-electric/5 border-electric/20'}`}>
            <p className="font-semibold">{n.title}</p>
            <p className="text-slate-600 mt-1">{n.body}</p>
            {!n.read && (
              <button type="button" onClick={async () => { await markNotificationRead(n.id); if (user) getUserNotifications(user.uid).then(setItems) }} className="text-xs text-electric font-semibold mt-2">
                Marcar leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
