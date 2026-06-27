'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { listAllUsers } from '@/lib/users/profile'
import type { UserProfile } from '@/types'

export default function AdminAfiliadosPage() {
  const [affiliates, setAffiliates] = useState<UserProfile[]>([])

  useEffect(() => {
    listAllUsers().then((all) => setAffiliates(all.filter((u) => u.role === 'affiliate')))
  }, [])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Afiliados</h1>
      <p className="text-slate-500 mt-1">Partners comerciales registrados.</p>
      <ul className="mt-8 space-y-2">
        {!affiliates.length ? (
          <li className="text-slate-500">No hay afiliados registrados.</li>
        ) : affiliates.map((u) => (
          <li key={u.uid} className="rounded-xl bg-white border border-slate-100 px-4 py-4">
            <p className="font-semibold">{u.name || 'Sin nombre'}</p>
            <p className="text-sm text-slate-500">{u.email}</p>
          </li>
        ))}
      </ul>
      <Link href="/afiliados" className="text-sm text-electric font-semibold mt-6 inline-block">Ver página pública de afiliados →</Link>
    </div>
  )
}
