import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listAllUsers, updateUserRole, ROLES } from '../../lib/users'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAllUsers().then(setUsers).finally(() => setLoading(false))
  }, [])

  async function toggleRole(uid, currentRole) {
    const next = currentRole === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN
    await updateUserRole(uid, next)
    setUsers((prev) => prev.map((u) => (u.id === uid ? { ...u, role: next } : u)))
  }

  return (
    <DashboardLayout variant="admin">
      <h1 className="heading-xl text-2xl md:text-3xl text-ink mb-8">Usuarios registrados</h1>

      {loading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Nombre</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Correo</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Rol</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{u.displayName || '—'}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === ROLES.ADMIN ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role === ROLES.ADMIN ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleRole(u.id, u.role)} className="text-xs text-electric font-semibold hover:underline">
                      {u.role === ROLES.ADMIN ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
