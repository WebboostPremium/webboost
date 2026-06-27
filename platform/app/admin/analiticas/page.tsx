'use client'

import { useEffect, useState } from 'react'
import { listAllProspects } from '@/lib/expansion/prospects'
import { listAllCommissions } from '@/lib/expansion/commissions'
import { listAllTickets } from '@/lib/expansion/tickets'
import { listAllUsers } from '@/lib/users/profile'
import { listAllProjects } from '@/lib/expansion/projects'

export default function AnaliticasPage() {
  const [stats, setStats] = useState({
    clients: 0,
    prospects: 0,
    projects: 0,
    commissions: 0,
    ticketsOpen: 0,
    ticketsClosed: 0,
    affiliates: 0,
  })

  useEffect(() => {
    Promise.all([
      listAllUsers(),
      listAllProspects(),
      listAllProjects(),
      listAllCommissions(),
      listAllTickets(),
    ]).then(([users, prospects, projects, commissions, tickets]) => {
      setStats({
        clients: users.filter((u) => u.role === 'client').length,
        affiliates: users.filter((u) => u.role === 'affiliate').length,
        prospects: prospects.length,
        projects: projects.length,
        commissions: commissions.filter((x) => x.status === 'pendiente').length,
        ticketsOpen: tickets.filter((x) => x.status === 'abierto' || x.status === 'en_revision').length,
        ticketsClosed: tickets.filter((x) => x.status === 'cerrado').length,
      })
    })
  }, [])

  const cards = [
    { label: 'Clientes', value: stats.clients },
    { label: 'Afiliados', value: stats.affiliates },
    { label: 'Prospectos', value: stats.prospects },
    { label: 'Proyectos activos', value: stats.projects },
    { label: 'Comisiones pendientes', value: stats.commissions },
    { label: 'Tickets abiertos', value: stats.ticketsOpen },
    { label: 'Tickets cerrados', value: stats.ticketsClosed },
  ]

  return (
    <div>
      <h1 className="heading-xl text-2xl md:text-3xl text-ink">Analíticas</h1>
      <p className="text-slate-500 mt-2">Indicadores globales de la plataforma WebBoost.</p>
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
