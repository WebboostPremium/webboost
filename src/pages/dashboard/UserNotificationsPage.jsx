import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getUserNotifications, markNotificationRead, markAllRead } from '../../lib/notifications'

export default function UserNotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserNotifications(user.uid).then(setItems).finally(() => setLoading(false))
  }, [user])

  async function handleRead(id) {
    await markNotificationRead(id)
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  async function handleReadAll() {
    if (!user) return
    await markAllRead(user.uid)
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <DashboardLayout variant="user">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-xl text-2xl md:text-3xl text-ink">Notificaciones</h1>
          <p className="text-slate-500 mt-1">Avisos y novedades del equipo WebBooost.</p>
        </div>
        {items.some((n) => !n.read) && (
          <button type="button" onClick={handleReadAll} className="btn-outline text-sm">
            Marcar todas como leídas
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center text-slate-500">
          No tienes notificaciones por ahora.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border p-5 ${n.read ? 'bg-white border-slate-100' : 'bg-electric/5 border-electric/20'}`}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{n.title}</p>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{n.body}</p>
                </div>
                {!n.read && (
                  <button type="button" onClick={() => handleRead(n.id)} className="text-xs text-electric font-semibold shrink-0">
                    Marcar leída
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  )
}
