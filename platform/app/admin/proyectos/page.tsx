'use client'

import { useEffect, useState } from 'react'
import { listAllProjects } from '@/lib/expansion/projects'

export default function AdminProyectosPage() {
  const [projects, setProjects] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    listAllProjects().then(setProjects)
  }, [])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Proyectos</h1>
      <p className="text-slate-500 mt-1">Proyectos activos y en curso.</p>
      <ul className="mt-8 space-y-2">
        {!projects.length ? (
          <li className="text-slate-500">No hay proyectos registrados.</li>
        ) : projects.map((p) => (
          <li key={p.id as string} className="rounded-xl bg-white border border-slate-100 px-4 py-4 flex justify-between">
            <div>
              <p className="font-semibold">{(p.title as string) || 'Proyecto sin título'}</p>
              <p className="text-sm text-slate-500">Cliente: {String(p.clientId || '—')}</p>
            </div>
            <span className="text-xs capitalize text-slate-400">{String(p.status || 'pendiente').replace(/_/g, ' ')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
