'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthProvider'
import { listAffiliateFollowUps } from '@/lib/expansion/prospects'
import { EmptyState } from '@/components/ui/EmptyState'
import { History } from 'lucide-react'

export default function SeguimientosPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<Awaited<ReturnType<typeof listAffiliateFollowUps>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    listAffiliateFollowUps(user.uid).then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [user])

  if (loading) return <p className="text-slate-500">Cargando seguimientos...</p>

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Seguimientos</h1>
      <p className="text-slate-500 mt-1">Bitácora de contactos y acciones con prospectos.</p>

      {!entries.length ? (
        <EmptyState icon={History} title="Sin seguimientos" description="Registra seguimientos desde el detalle de un prospecto." />
      ) : (
        <ul className="mt-8 space-y-2">
          {entries.map((h) => (
            <li key={h.id} className="rounded-xl bg-white border border-slate-100 px-4 py-4">
              <div className="flex justify-between gap-4">
                <div>
                  <Link href={`/afiliado/dashboard/prospectos/${h.prospectId}`} className="font-semibold text-ink hover:text-electric">
                    {h.prospectName}
                  </Link>
                  <p className="text-sm text-slate-600 mt-1 capitalize">{(h.actionType as string).replace(/_/g, ' ')}</p>
                  <p className="text-sm text-slate-500 mt-1">{h.comment}</p>
                </div>
                <p className="text-xs text-slate-400 shrink-0">{h.userName}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
