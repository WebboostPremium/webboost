'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthProvider'
import { listProspectsByAffiliate } from '@/lib/expansion/prospects'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'
import type { Prospect } from '@/types/expansion'

const CLIENT_STATUSES = new Set(['venta_cerrada', 'proyecto_iniciado'])

export default function ClientesPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Prospect[]>([])

  useEffect(() => {
    if (!user) return
    listProspectsByAffiliate(user.uid).then((prospects) => {
      setClients(prospects.filter((p) => CLIENT_STATUSES.has(p.status)))
    })
  }, [user])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Clientes</h1>
      <p className="text-slate-500 mt-1">Prospectos convertidos en clientes activos.</p>

      {!clients.length ? (
        <EmptyState icon={Users} title="Sin clientes aún" description="Los prospectos cerrados aparecerán aquí." />
      ) : (
        <ul className="mt-8 space-y-2">
          {clients.map((c) => (
            <li key={c.id} className="rounded-xl bg-white border border-slate-100 px-4 py-4 flex justify-between">
              <div>
                <Link href={`/afiliado/dashboard/prospectos/${c.id}`} className="font-semibold text-ink hover:text-electric">
                  {c.companyName}
                </Link>
                <p className="text-sm text-slate-500">{c.contactName} · {c.email}</p>
              </div>
              <span className="text-xs capitalize text-slate-400">{c.status.replace(/_/g, ' ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
