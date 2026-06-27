'use client'

import { useEffect, useState } from 'react'
import { listAllUsers } from '@/lib/users/profile'
import type { UserProfile } from '@/types'

export default function AdminClientesPage() {
  const [users, setUsers] = useState<UserProfile[]>([])

  useEffect(() => {
    listAllUsers().then((all) => setUsers(all.filter((u) => u.role === 'client')))
  }, [])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Clientes</h1>
      <p className="text-slate-500 mt-1">Usuarios registrados con rol de cliente.</p>
      <ul className="mt-8 space-y-2">
        {!users.length ? (
          <li className="text-slate-500">No hay clientes registrados.</li>
        ) : users.map((u) => (
          <li key={u.uid} className="rounded-xl bg-white border border-slate-100 px-4 py-4 flex justify-between">
            <div>
              <p className="font-semibold">{u.name || 'Sin nombre'}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
            <span className="text-xs capitalize text-slate-400">{u.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
