'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { listDemoSessions, demoSessionStatusLabel } from '@/lib/expansion/demo-sessions'
import type { DemoWizardSession } from '@/types/expansion'

const STATUSES = ['submitted', 'paid', 'reviewed', 'contacted', 'closed'] as const

export default function AdminDemosPage() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState<DemoWizardSession[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  function load() {
    listDemoSessions().then(setSessions)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/demos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes[id] }),
    })
    if (!res.ok) {
      toast('Error al actualizar', 'error')
      return
    }
    toast('Estado actualizado', 'success')
    load()
  }

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Demo Personalizada</h1>
      <p className="text-slate-500 mt-1">Solicitudes del wizard de demo ($5).</p>

      <ul className="mt-8 space-y-2">
        {!sessions.length ? (
          <li className="text-slate-500">No hay solicitudes de demo aún.</li>
        ) : sessions.map((s) => (
          <li key={s.id} className="rounded-xl bg-white border border-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className="w-full px-4 py-4 flex justify-between items-center text-left hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold">{s.data?.businessInfo?.name || 'Sin nombre'}</p>
                <p className="text-sm text-slate-500">{s.email} · ${s.amount}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium capitalize ${
                  s.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {s.paymentStatus}
                </span>
                <p className="text-xs text-slate-400 mt-1">{demoSessionStatusLabel(s.status)}</p>
              </div>
            </button>

            {expanded === s.id && (
              <div className="px-4 pb-4 border-t border-slate-50 space-y-3">
                <div className="grid sm:grid-cols-2 gap-2 text-sm pt-3">
                  <p><strong>Contacto:</strong> {s.data?.businessInfo?.contactName}</p>
                  <p><strong>Teléfono:</strong> {s.data?.businessInfo?.phone}</p>
                  <p><strong>Tipo:</strong> {s.data?.businessInfo?.businessType}</p>
                  <p><strong>Estilo:</strong> {s.data?.style || '—'}</p>
                  <p className="sm:col-span-2"><strong>Secciones:</strong> {s.data?.sections?.join(', ')}</p>
                </div>
                <textarea
                  value={notes[s.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })}
                  placeholder="Notas internas"
                  rows={2}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(s.id, st)}
                      className={`text-xs px-3 py-1.5 rounded-lg border ${
                        s.status === st ? 'bg-electric/10 border-electric text-electric' : 'border-slate-200'
                      }`}
                    >
                      {demoSessionStatusLabel(st)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
