import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listAllUsers } from '../../lib/users'
import { sendNotificationToUser, sendNotificationToAll, listAllNotifications } from '../../lib/notifications'

export default function AdminNotificationsPage() {
  const [users, setUsers] = useState([])
  const [history, setHistory] = useState([])
  const [form, setForm] = useState({ target: 'all', userId: '', title: '', message: '' })
  const [sending, setSending] = useState(false)

  function load() {
    Promise.all([listAllUsers(), listAllNotifications()]).then(([u, n]) => {
      setUsers(u)
      setHistory(n.slice(0, 20))
    })
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.message) return
    setSending(true)
    try {
      if (form.target === 'all') {
        await sendNotificationToAll(users, { title: form.title, body: form.message })
      } else {
        await sendNotificationToUser(form.userId, { title: form.title, body: form.message })
      }
      setForm({ target: 'all', userId: '', title: '', message: '' })
      load()
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout variant="admin">
      <h1 className="heading-xl text-2xl md:text-3xl text-ink mb-8">Enviar notificaciones</h1>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-100 p-6 mb-8 max-w-xl space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Destinatario</label>
          <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
            <option value="all">Todos los usuarios</option>
            <option value="user">Usuario específico</option>
          </select>
        </div>
        {form.target === 'user' && (
          <select required value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
            <option value="">Seleccionar usuario</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.displayName || u.email}</option>
            ))}
          </select>
        )}
        <input required placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
        <textarea required placeholder="Mensaje" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm min-h-[100px]" />
        <button type="submit" disabled={sending} className="btn-cta inline-flex items-center gap-2 disabled:opacity-60">
          <Send className="w-4 h-4" />
          {sending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      <h2 className="font-bold text-ink mb-4">Historial reciente</h2>
      <ul className="space-y-2">
        {history.map((n) => (
          <li key={n.id} className="rounded-xl bg-white border border-slate-100 px-4 py-3 text-sm">
            <p className="font-semibold">{n.title}</p>
            <p className="text-slate-500">{n.body}</p>
            <p className="text-xs text-slate-400 mt-1">{n.userId || 'Todos los usuarios'}</p>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  )
}
