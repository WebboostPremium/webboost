'use client'

import { useEffect, useState } from 'react'
import { listAllProspects } from '@/lib/expansion/prospects'
import { listAllCommissions } from '@/lib/expansion/commissions'
import { listAllTickets } from '@/lib/expansion/tickets'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ prospects: 0, commissions: 0, ticketsOpen: 0, ticketsClosed: 0 })

  useEffect(() => {
    Promise.all([listAllProspects(), listAllCommissions(), listAllTickets()]).then(([p, c, t]) => {
      setStats({
        prospects: p.length,
        commissions: c.filter((x) => x.status === 'pendiente').length,
        ticketsOpen: t.filter((x) => x.status === 'abierto' || x.status === 'en_revision').length,
        ticketsClosed: t.filter((x) => x.status === 'cerrado').length,
      })
    })
  }, [])

  const cards = [
    { label: 'Prospectos', value: stats.prospects },
    { label: 'Comisiones pendientes', value: stats.commissions },
    { label: 'Tickets abiertos', value: stats.ticketsOpen },
    { label: 'Tickets cerrados', value: stats.ticketsClosed },
    { label: 'Clientes', value: '—' },
    { label: 'Proyectos activos', value: '—' },
  ]

  return (
    <div>
      <h1 className="heading-xl text-2xl md:text-3xl text-ink">Panel de administración</h1>
      <p className="text-slate-500 mt-2">Indicadores ampliados del módulo de expansión.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {cards.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white border border-slate-100 p-5">
            <p className="text-3xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
