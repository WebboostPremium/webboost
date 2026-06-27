'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import {
  listProspectsByAffiliate, createProspect, changeProspectStatus,
} from '@/lib/expansion/prospects'
import { sendNotification } from '@/lib/expansion/notifications'
import { logAudit } from '@/lib/expansion/audit'
import { PROSPECT_STATUSES } from '@/lib/constants/expansion'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { Prospect, InterestLevel } from '@/types/expansion'

export default function ProspectosPageInner() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1')

  function load() {
    if (!user) return
    listProspectsByAffiliate(user.uid).then(setProspects).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [user])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const fd = new FormData(e.currentTarget)
    try {
      await createProspect(user.uid, {
        companyName: fd.get('companyName') as string,
        contactName: fd.get('contactName') as string,
        contactRole: fd.get('contactRole') as string,
        phone: fd.get('phone') as string,
        whatsapp: fd.get('whatsapp') as string,
        email: fd.get('email') as string,
        address: fd.get('address') as string,
        serviceInterest: fd.get('serviceInterest') as string,
        estimatedBudget: Number(fd.get('estimatedBudget')) || undefined,
        interestLevel: fd.get('interestLevel') as InterestLevel,
        notes: fd.get('notes') as string,
        firstContactDate: fd.get('firstContactDate') as string,
        nextFollowUp: (fd.get('nextFollowUp') as string) || undefined,
      })
      await logAudit({
        userId: user.uid,
        userName: profile?.name || user.email || '',
        role: 'affiliate',
        action: 'prospect_created',
        affiliateId: user.uid,
        details: fd.get('companyName') as string,
      })
      await sendNotification({
        userId: '__admins__',
        role: 'admin',
        type: 'prospect_new',
        title: 'Nuevo prospecto',
        body: `${fd.get('companyName')} registrado por afiliado`,
        link: '/admin/prospectos',
      })
      toast('Prospecto registrado', 'success')
      setShowForm(false)
      load()
    } catch {
      toast('Error al registrar', 'error')
    }
  }

  if (loading) return <div className="grid gap-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-xl text-2xl md:text-3xl text-ink">Mis Prospectos</h1>
          <p className="text-slate-500 mt-1">CRM de clientes potenciales</p>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)} className="btn-cta inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo prospecto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl bg-white border border-slate-100 p-6 mb-8 grid sm:grid-cols-2 gap-4">
          <input required name="companyName" placeholder="Nombre de la empresa *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input required name="contactName" placeholder="Nombre del contacto *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input name="contactRole" placeholder="Cargo" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input required name="phone" placeholder="Teléfono *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input required name="whatsapp" placeholder="WhatsApp *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input required type="email" name="email" placeholder="Correo *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input name="address" placeholder="Dirección" className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input required name="serviceInterest" placeholder="Servicio de interés *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input type="number" name="estimatedBudget" placeholder="Presupuesto aprox." className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <select required name="interestLevel" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
            <option value="alto">Interés alto</option>
            <option value="medio">Interés medio</option>
            <option value="bajo">Interés bajo</option>
          </select>
          <input type="date" name="firstContactDate" required className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <input type="date" name="nextFollowUp" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <textarea name="notes" placeholder="Observaciones" rows={2} className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
          <button type="submit" className="sm:col-span-2 btn-cta">Guardar prospecto</button>
        </form>
      )}

      {!prospects.length ? (
        <EmptyState icon={Building2} title="Sin prospectos" description="Registra tu primer cliente potencial." action={<button type="button" onClick={() => setShowForm(true)} className="btn-cta">Agregar prospecto</button>} />
      ) : (
        <div className="space-y-3">
          {prospects.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white border border-slate-100 p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <Link href={`/afiliado/dashboard/prospectos/${p.id}`} className="font-bold text-ink hover:text-electric">{p.companyName}</Link>
                  <p className="text-sm text-slate-500">{p.contactName} · {p.email}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-2 inline-block capitalize">{p.status.replace(/_/g, ' ')}</span>
                </div>
                <select
                  value={p.status}
                  onChange={async (e) => {
                    if (!user) return
                    await changeProspectStatus(p.id, e.target.value as Prospect['status'], user.uid, profile?.name || '', 'Cambio de estado')
                    toast('Estado actualizado', 'success')
                    load()
                  }}
                  className="text-xs rounded-lg border border-slate-200 px-2 py-1"
                >
                  {PROSPECT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
