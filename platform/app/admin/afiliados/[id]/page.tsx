'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'
import { getAffiliateDashboardStats, buildReferralLink } from '@/lib/expansion/affiliates'
import { listProspectsByAffiliate } from '@/lib/expansion/prospects'
import { listCommissionsByAffiliate } from '@/lib/expansion/commissions'
import type { Affiliate, AffiliateStatus } from '@/types'
import type { Prospect, Commission } from '@/types/expansion'

export default function AdminAfiliadoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAffiliateDashboardStats>> | null>(null)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [code, setCode] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<AffiliateStatus>('active')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/affiliates/${id}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.affiliate) return
        const aff = data.affiliate as Affiliate
        setAffiliate(aff)
        setCode(aff.code || '')
        setNotes(aff.notes || '')
        setStatus(aff.status || 'active')
        const [st, p, c] = await Promise.all([
          getAffiliateDashboardStats(aff.userId),
          listProspectsByAffiliate(aff.userId),
          listCommissionsByAffiliate(aff.userId),
        ])
        setStats(st)
        setProspects(p)
        setCommissions(c)
      })
  }, [id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, notes, status }),
      })
      if (!res.ok) throw new Error()
      toast('Afiliado actualizado', 'success')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function copyLink() {
    if (!code) return
    await navigator.clipboard.writeText(buildReferralLink(code))
    setCopied(true)
    toast('Enlace copiado', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!affiliate) {
    return <p className="text-slate-500">Cargando afiliado…</p>
  }

  return (
    <div>
      <Link href="/admin/afiliados" className="inline-flex items-center gap-1 text-sm text-electric font-semibold mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a afiliados
      </Link>

      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="heading-xl text-2xl text-ink">{affiliate.name}</h1>
          <p className="text-slate-500 mt-1">{affiliate.email}</p>
        </div>
        <span className={`self-start text-xs px-3 py-1 rounded-full font-medium ${
          status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Prospectos', value: stats.prospects },
            { label: 'Conversión', value: `${stats.conversion}%` },
            { label: 'Comisiones pendientes', value: `$${stats.pendingCommission.toFixed(0)}` },
            { label: 'Ventas cerradas', value: stats.closedSales },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-white border border-slate-100 p-5">
              <p className="text-2xl font-extrabold text-ink">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 rounded-2xl bg-white border border-slate-100 p-6 space-y-4 max-w-xl">
        <h2 className="font-bold text-ink">Configuración del afiliado</h2>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Código de referido</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono"
            />
            <button type="button" onClick={copyLink} className="px-3 rounded-xl border border-slate-200 hover:bg-slate-50">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AffiliateStatus)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Notas internas (solo admin)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            placeholder="Notas sobre este afiliado…"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-cta text-sm disabled:opacity-60">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-white border border-slate-100 p-6">
          <h2 className="font-bold text-ink mb-4">Prospectos ({prospects.length})</h2>
          {!prospects.length ? (
            <p className="text-sm text-slate-500">Sin prospectos.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {prospects.map((p) => (
                <li key={p.id} className="flex justify-between text-sm py-2 border-b border-slate-50">
                  <span>{p.companyName}</span>
                  <span className="text-xs capitalize text-slate-400">{p.status.replace(/_/g, ' ')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-6">
          <h2 className="font-bold text-ink mb-4">Comisiones ({commissions.length})</h2>
          {!commissions.length ? (
            <p className="text-sm text-slate-500">Sin comisiones.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {commissions.map((c) => (
                <li key={c.id} className="flex justify-between text-sm py-2 border-b border-slate-50">
                  <span className="capitalize">{c.status}</span>
                  <span className="font-semibold text-electric">${c.commissionAmount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
