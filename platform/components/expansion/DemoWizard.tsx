'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { StepProgress } from '@/components/ui/ProgressBar'
import { useToast } from '@/components/ui/ToastProvider'
import { SITE } from '@/config/site'
import {
  DEMO_STYLES, DEMO_SECTIONS, DEMO_FEATURES, COLOR_PRESETS,
} from '@/lib/constants/expansion'
import type { DemoWizardData } from '@/types/expansion'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'

const STORAGE_KEY = 'webboost-demo-wizard'
const TOTAL_STEPS = 10

const emptyData = (): DemoWizardData => ({
  step: 0,
  businessInfo: { name: '', contactName: '', email: '', phone: '', businessType: '', description: '' },
  logo: { url: '', noLogo: false },
  colorPalette: {},
  style: '',
  typography: 'Plus Jakarta Sans',
  sections: ['Inicio', 'Contacto', 'WhatsApp'],
  features: ['WhatsApp', 'Formularios'],
  inspiration: { links: [], notes: '' },
})

export function DemoWizard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<DemoWizardData>(emptyData)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DemoWizardData
        setData(parsed)
        setStep(parsed.step || 0)
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, step }))
  }, [data, step])

  function update(partial: Partial<DemoWizardData>) {
    setData((prev) => ({ ...prev, ...partial }))
  }

  async function handleSubmit() {
    setSaving(true)
    try {
      const sessionId = crypto.randomUUID()
      if (db) {
        await setDoc(doc(db, COLLECTIONS.demoWizardSessions, sessionId), {
          email: data.businessInfo.email,
          userId: user?.uid || '',
          data,
          amount: SITE.demoPrice,
          paymentStatus: 'pending',
          status: 'submitted',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
      localStorage.removeItem(STORAGE_KEY)
      toast('Solicitud guardada. Redirigiendo al pago...', 'success')
      router.push(`/demo/gracias?id=${sessionId}`)
    } catch {
      toast('Error al guardar. Intenta de nuevo.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const stepTitles = [
    'Tu negocio', 'Logo', 'Colores', 'Estilo', 'Tipografía',
    'Secciones', 'Funcionalidades', 'Inspiración', 'Resumen', 'Pago',
  ]

  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="heading-xl text-3xl md:text-4xl text-ink">Configura tu demo</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Paso {step + 1} de {TOTAL_STEPS}: {stepTitles[step]}
          </p>
          <div className="mt-4">
            <StepProgress current={step} total={TOTAL_STEPS} />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 md:p-8 shadow-sm min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <input placeholder="Nombre del negocio *" value={data.businessInfo.name} onChange={(e) => update({ businessInfo: { ...data.businessInfo, name: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                  <input placeholder="Tu nombre *" value={data.businessInfo.contactName} onChange={(e) => update({ businessInfo: { ...data.businessInfo, contactName: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                  <input type="email" placeholder="Correo *" value={data.businessInfo.email} onChange={(e) => update({ businessInfo: { ...data.businessInfo, email: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                  <input placeholder="WhatsApp *" value={data.businessInfo.phone} onChange={(e) => update({ businessInfo: { ...data.businessInfo, phone: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                  <input placeholder="Tipo de negocio *" value={data.businessInfo.businessType} onChange={(e) => update({ businessInfo: { ...data.businessInfo, businessType: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                  <textarea placeholder="Describe tu proyecto *" value={data.businessInfo.description} onChange={(e) => update({ businessInfo: { ...data.businessInfo, description: e.target.value } })} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Sube tu logo</span>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) update({ logo: { url: URL.createObjectURL(file), noLogo: false } })
                    }} className="text-sm" />
                  </label>
                  {data.logo?.url && <img src={data.logo.url} alt="Preview" className="h-24 object-contain rounded-xl border border-slate-100 p-2" />}
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={data.logo?.noLogo} onChange={(e) => update({ logo: { url: '', noLogo: e.target.checked } })} />
                    No tengo logo, deseo que WebBoost me ayude
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((p) => (
                    <button key={p.id} type="button" onClick={() => update({ colorPalette: { preset: p.id } })} className={`rounded-xl border p-4 text-left transition-colors ${data.colorPalette.preset === p.id ? 'border-electric ring-2 ring-electric/20' : 'border-slate-200'}`}>
                      <div className="flex gap-1 mb-2">{p.colors.map((c) => <span key={c} className="w-6 h-6 rounded-full" style={{ background: c }} />)}</div>
                      <span className="text-xs font-medium">{p.name}</span>
                    </button>
                  ))}
                  <input type="color" onChange={(e) => update({ colorPalette: { custom: e.target.value } })} className="col-span-full h-10 rounded-xl" title="Color personalizado" />
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEMO_STYLES.map((s) => (
                    <button key={s} type="button" onClick={() => update({ style: s })} className={`rounded-xl border px-4 py-6 text-sm font-semibold transition-colors ${data.style === s ? 'border-electric bg-electric/5 text-electric' : 'border-slate-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  {['Plus Jakarta Sans', 'Inter', 'Poppins', 'Montserrat', 'Roboto'].map((f) => (
                    <button key={f} type="button" onClick={() => update({ typography: f })} className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${data.typography === f ? 'border-electric bg-electric/5' : 'border-slate-200'}`} style={{ fontFamily: f }}>
                      <span className="text-lg font-bold">{f}</span>
                      <p className="text-sm text-slate-500 mt-1">Soluciones digitales para tu negocio</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-wrap gap-2">
                  {DEMO_SECTIONS.map((s) => {
                    const selected = data.sections.includes(s)
                    return (
                      <button key={s} type="button" onClick={() => update({ sections: selected ? data.sections.filter((x) => x !== s) : [...data.sections, s] })} className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${selected ? 'border-electric bg-electric/10 text-electric' : 'border-slate-200'}`}>
                        {selected && <Check className="w-3 h-3 inline mr-1" />}{s}
                      </button>
                    )
                  })}
                </div>
              )}

              {step === 6 && (
                <div className="flex flex-wrap gap-2">
                  {DEMO_FEATURES.map((f) => {
                    const selected = data.features.includes(f)
                    return (
                      <button key={f} type="button" onClick={() => update({ features: selected ? data.features.filter((x) => x !== f) : [...data.features, f] })} className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${selected ? 'border-electric bg-electric/10 text-electric' : 'border-slate-200'}`}>
                        {f}
                      </button>
                    )
                  })}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-4">
                  <textarea placeholder="Enlaces de referencia (uno por línea)" value={data.inspiration.links.join('\n')} onChange={(e) => update({ inspiration: { ...data.inspiration, links: e.target.value.split('\n').filter(Boolean) } })} rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                  <textarea placeholder="Notas e inspiración adicional" value={data.inspiration.notes} onChange={(e) => update({ inspiration: { ...data.inspiration, notes: e.target.value } })} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                </div>
              )}

              {step === 8 && (
                <div className="space-y-3 text-sm">
                  <SummaryRow label="Negocio" value={data.businessInfo.name} />
                  <SummaryRow label="Estilo" value={data.style} />
                  <SummaryRow label="Tipografía" value={data.typography} />
                  <SummaryRow label="Secciones" value={data.sections.join(', ')} />
                  <SummaryRow label="Funcionalidades" value={data.features.join(', ')} />
                  <p className="text-xs text-slate-400 pt-2">Puedes regresar a cualquier paso para editar.</p>
                </div>
              )}

              {step === 9 && (
                <div className="text-center py-6">
                  <p className="text-4xl font-extrabold text-ink">${SITE.demoPrice} <span className="text-lg font-normal text-slate-400">USD</span></p>
                  <p className="text-slate-500 mt-2 text-sm">Se descuenta del proyecto si avanzas con WebBooost.</p>
                  <p className="text-xs text-slate-400 mt-4">Pago seguro con Wompi</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-6">
          <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="btn-outline disabled:opacity-40 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          {step < TOTAL_STEPS - 1 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-cta flex items-center gap-1">
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" disabled={saving} onClick={handleSubmit} className="btn-cta disabled:opacity-60">
              {saving ? 'Procesando...' : `Pagar $${SITE.demoPrice}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-50">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-ink text-right">{value || '—'}</span>
    </div>
  )
}
