'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserPlus, Users, DollarSign, Search } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'
import { listAllUsers } from '@/lib/users/profile'
import { listAllAffiliates, getAffiliateDashboardStats } from '@/lib/expansion/affiliates'
import type { UserProfile } from '@/types'
import type { Affiliate } from '@/types'

type AffiliateRow = Affiliate & {
  stats?: Awaited<ReturnType<typeof getAffiliateDashboardStats>>
}

export default function AdminAfiliadosPage() {
  const { toast } = useToast()
  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([])
  const [clients, setClients] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [promoteEmail, setPromoteEmail] = useState('')
  const [promoteCode, setPromoteCode] = useState('')
  const [promoting, setPromoting] = useState(false)

  async function load() {
    setLoading(true)
    const [affRecords, allUsers] = await Promise.all([
      listAllAffiliates(),
      listAllUsers(),
    ])

    const enriched = await Promise.all(
      affRecords.map(async (a) => ({
        ...a,
        stats: await getAffiliateDashboardStats(a.userId),
      })),
    )

    setAffiliates(enriched)
    setClients(allUsers.filter((u) => u.role === 'client'))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handlePromote(e: React.FormEvent) {
    e.preventDefault()
    if (!promoteEmail.trim()) return
    setPromoting(true)
    try {
      const res = await fetch('/api/admin/affiliates/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: promoteEmail.trim(),
          code: promoteCode.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al promover')
      toast(`Afiliado activado: ${data.affiliate?.code}`, 'success')
      setPromoteEmail('')
      setPromoteCode('')
      load()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Error al promover', 'error')
    } finally {
      setPromoting(false)
    }
  }

  async function toggleStatus(affiliate: AffiliateRow) {
    const newStatus = affiliate.status === 'active' ? 'inactive' : 'active'
    const res = await fetch(`/api/admin/affiliates/${affiliate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast(newStatus === 'active' ? 'Afiliado activado' : 'Afiliado desactivado', 'success')
      load()
    } else {
      toast('Error al actualizar estado', 'error')
    }
  }

  const filtered = affiliates.filter((a) => {
    const q = search.toLowerCase()
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.code?.toLowerCase().includes(q)
    )
  })

  const totals = affiliates.reduce(
    (acc, a) => ({
      prospects: acc.prospects + (a.stats?.prospects || 0),
      pending: acc.pending + (a.stats?.pendingCommission || 0),
      paid: acc.paid + (a.stats?.paidCommission || 0),
    }),
    { prospects: 0, pending: 0, paid: 0 },
  )

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Gestión de afiliados</h1>
      <p className="text-slate-500 mt-1">Administra partners, códigos de referido y rendimiento.</p>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <Users className="w-7 h-7 text-electric mb-2" />
          <p className="text-2xl font-extrabold text-ink">{affiliates.length}</p>
          <p className="text-sm text-slate-500">Afiliados registrados</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <DollarSign className="w-7 h-7 text-amber-500 mb-2" />
          <p className="text-2xl font-extrabold text-ink">${totals.pending.toFixed(0)}</p>
          <p className="text-sm text-slate-500">Comisiones pendientes</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <DollarSign className="w-7 h-7 text-emerald-500 mb-2" />
          <p className="text-2xl font-extrabold text-ink">${totals.paid.toFixed(0)}</p>
          <p className="text-sm text-slate-500">Comisiones pagadas</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <form onSubmit={handlePromote} className="rounded-2xl bg-white border border-slate-100 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-electric" />
            <h2 className="font-bold text-ink">Promover a afiliado</h2>
          </div>
          <p className="text-sm text-slate-500">
            El usuario debe estar registrado. Ingresa su email para activar el rol de afiliado.
          </p>
          <input
            required
            type="email"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            placeholder="email@ejemplo.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <input
            type="text"
            value={promoteCode}
            onChange={(e) => setPromoteCode(e.target.value.toUpperCase())}
            placeholder="Código personalizado (opcional)"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono"
          />
          <button type="submit" disabled={promoting} className="btn-cta w-full text-sm disabled:opacity-60">
            {promoting ? 'Procesando…' : 'Activar como afiliado'}
          </button>
          {clients.length > 0 && (
            <p className="text-xs text-slate-400">
              {clients.length} cliente{clients.length > 1 ? 's' : ''} disponible{clients.length > 1 ? 's' : ''} para promover
            </p>
          )}
        </form>

        <div className="rounded-2xl bg-white border border-slate-100 p-6">
          <h2 className="font-bold text-ink mb-4">Clientes sin promover</h2>
          {!clients.length ? (
            <p className="text-sm text-slate-500">No hay clientes registrados.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {clients.slice(0, 8).map((u) => (
                <li key={u.uid} className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                  <span className="truncate">{u.email}</span>
                  <button
                    type="button"
                    onClick={() => { setPromoteEmail(u.email); }}
                    className="text-xs text-electric font-semibold shrink-0 ml-2"
                  >
                    Seleccionar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="font-bold text-ink">Afiliados activos</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o código…"
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm w-full sm:w-72"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 mt-6">Cargando afiliados…</p>
      ) : !filtered.length ? (
        <p className="text-slate-500 mt-6">No hay afiliados registrados.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white border border-slate-100 p-5">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/admin/afiliados/${a.id}`} className="font-bold text-ink hover:text-electric">
                      {a.name || 'Sin nombre'}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      a.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {a.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{a.email}</p>
                  <p className="text-xs font-mono text-electric mt-1">Código: {a.code}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-ink">{a.stats?.prospects ?? 0}</p>
                    <p className="text-xs text-slate-400">Prospectos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-ink">{a.stats?.closedSales ?? 0}</p>
                    <p className="text-xs text-slate-400">Ventas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-electric">${(a.stats?.pendingCommission ?? 0).toFixed(0)}</p>
                    <p className="text-xs text-slate-400">Pendiente</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link href={`/admin/afiliados/${a.id}`} className="text-xs text-electric font-semibold px-3 py-1.5 rounded-lg bg-electric/5">
                  Ver detalle
                </Link>
                <Link href="/admin/prospectos" className="text-xs text-slate-600 font-semibold px-3 py-1.5 rounded-lg bg-slate-50">
                  Prospectos
                </Link>
                <Link href="/admin/comisiones" className="text-xs text-slate-600 font-semibold px-3 py-1.5 rounded-lg bg-slate-50">
                  Comisiones
                </Link>
                <button
                  type="button"
                  onClick={() => toggleStatus(a)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600"
                >
                  {a.status === 'active' ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/afiliados" className="text-sm text-electric font-semibold mt-8 inline-block">
        Ver página pública de afiliados →
      </Link>
    </div>
  )
}
