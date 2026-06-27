'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { integrationStatus, type PlatformSettings } from '@/lib/settings'

export default function AdminConfiguracionPage() {
  const { toast } = useToast()
  const [form, setForm] = useState<PlatformSettings>({
    demoPrice: 5,
    defaultCommissionPercent: 10,
    supportWhatsapp: '',
    supportEmail: '',
    companyName: 'WebBooost',
  })
  const [saving, setSaving] = useState(false)
  const integrations = integrationStatus()

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setForm)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast('Configuración guardada', 'success')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Configuración</h1>
      <p className="text-slate-500 mt-1">Ajustes generales de la plataforma.</p>

      <div className="mt-8 rounded-2xl bg-white border border-slate-100 p-6">
        <h2 className="font-bold text-ink mb-4">Integraciones</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(integrations).map(([key, ok]) => (
            <li key={key} className="flex justify-between py-2 border-b border-slate-50">
              <span className="capitalize">{key}</span>
              <span className={ok ? 'text-green-600 font-medium' : 'text-amber-600'}>
                {ok ? 'Conectado' : 'Pendiente'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl bg-white border border-slate-100 p-6 space-y-4 max-w-xl">
        <h2 className="font-bold text-ink">Ajustes editables</h2>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Precio demo (USD)</label>
          <input type="number" step="0.01" value={form.demoPrice} onChange={(e) => setForm({ ...form, demoPrice: Number(e.target.value) })} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Comisión por defecto (%)</label>
          <input type="number" value={form.defaultCommissionPercent} onChange={(e) => setForm({ ...form, defaultCommissionPercent: Number(e.target.value) })} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">WhatsApp soporte</label>
          <input value={form.supportWhatsapp} onChange={(e) => setForm({ ...form, supportWhatsapp: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Email soporte</label>
          <input type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Nombre empresa</label>
          <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="btn-cta disabled:opacity-60">
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </form>
    </div>
  )
}
