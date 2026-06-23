import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listAllSites, createSite, updateSite, deleteSite, SITE_STATUS } from '../../lib/sites'
import { listAllUsers } from '../../lib/users'

export default function AdminSitesPage() {
  const [sites, setSites] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ userId: '', name: '', url: '', plan: 'Starter', status: SITE_STATUS.PENDING, notes: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  function load() {
    Promise.all([listAllSites(), listAllUsers()]).then(([s, u]) => {
      setSites(s)
      setUsers(u)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.userId || !form.name) return
    setSaving(true)
    try {
      const user = users.find((u) => u.id === form.userId)
      await createSite({ ...form, userEmail: user?.email })
      setForm({ userId: '', name: '', url: '', plan: 'Starter', status: SITE_STATUS.PENDING, notes: '' })
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este sitio?')) return
    await deleteSite(id)
    load()
  }

  return (
    <DashboardLayout variant="admin">
      <h1 className="heading-xl text-2xl md:text-3xl text-ink mb-8">Sitios web de clientes</h1>

      <form onSubmit={handleCreate} className="rounded-2xl bg-white border border-slate-100 p-6 mb-8 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-bold text-ink">Asignar sitio a usuario</h2>
        <select required value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
          <option value="">Seleccionar usuario</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.displayName || u.email}</option>
          ))}
        </select>
        <input required placeholder="Nombre del sitio" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
        <input placeholder="URL (https://...)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
        <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
          {['Starter', 'Business', 'Plataforma Pro', 'Premium'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
          {Object.entries(SITE_STATUS).map(([k, v]) => <option key={k} value={v}>{v}</option>)}
        </select>
        <textarea placeholder="Notas internas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm min-h-[80px]" />
        <button type="submit" disabled={saving} className="sm:col-span-2 btn-cta w-full sm:w-auto disabled:opacity-60">
          {saving ? 'Guardando...' : 'Crear sitio'}
        </button>
      </form>

      {loading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {sites.map((site) => (
            <div key={site.id} className="rounded-2xl bg-white border border-slate-100 p-5 flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-bold">{site.name}</p>
                <p className="text-sm text-slate-500">{site.userEmail}</p>
                <p className="text-xs text-slate-400">{site.plan} · {site.status}</p>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={site.status}
                  onChange={(e) => updateSite(site.id, { status: e.target.value }).then(load)}
                  className="text-xs rounded-lg border border-slate-200 px-2 py-1"
                >
                  {Object.values(SITE_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={() => handleDelete(site.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
