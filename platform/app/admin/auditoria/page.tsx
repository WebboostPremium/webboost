'use client'

import { useEffect, useState } from 'react'
import { listAuditLogs } from '@/lib/expansion/audit'
import type { AuditLogEntry } from '@/types/expansion'

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])

  useEffect(() => { listAuditLogs(200).then(setLogs) }, [])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Historial del sistema</h1>
      <p className="text-slate-500 mt-1">Auditoría completa de acciones.</p>
      <ul className="mt-8 space-y-2">
        {logs.map((l) => (
          <li key={l.id} className="rounded-xl bg-white border px-4 py-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-semibold">{l.action}</span>
              <span className="text-xs text-slate-400">{l.role}</span>
            </div>
            <p className="text-slate-600 mt-1">{l.userName} — {l.details}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
