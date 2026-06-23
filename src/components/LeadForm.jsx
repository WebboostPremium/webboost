import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, ExternalLink } from 'lucide-react'
import { SITE } from '../config/site'
import { formatLeadMessage, sendToTelegram } from '../lib/telegram'

const NEEDS = [
  'Página web profesional',
  'Plataforma completa a medida',
  'Dashboard / panel administrativo',
  'Catálogo o tienda online',
  'Sistema de facturación',
  'Automatización con WhatsApp',
  'Publicidad Google y Meta',
  'Otro',
]

const PLANS = ['Starter', 'Business', 'Plataforma Pro', 'Premium', 'Aún no sé']

export default function LeadForm({ hideHeader = false }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    negocio: '',
    necesidad: '',
    plan: '',
    mensaje: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('wb-plan')
    if (saved) {
      setForm((f) => ({ ...f, plan: saved }))
      sessionStorage.removeItem('wb-plan')
    }
  }, [])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.email.trim()) {
      setError('Nombre y correo son obligatorios.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')

    try {
      await sendToTelegram(formatLeadMessage(form))
      setStatus('success')
      setForm({ nombre: '', email: '', telefono: '', negocio: '', necesidad: '', plan: '', mensaje: '' })
    } catch (err) {
      setStatus('error')
      setError(err.message || 'No se pudo enviar. Intenta de nuevo o usa WhatsApp.')
    }
  }

  return (
    <section id="contacto" className={`section ${hideHeader ? 'pt-0' : ''}`} aria-labelledby={hideHeader ? undefined : 'contacto-heading'}>
      <div className="max-w-xl mx-auto px-5">
        {!hideHeader && (
          <div className="text-center mb-8">
            <h2 id="contacto-heading" className="heading-xl text-3xl md:text-4xl text-ink mb-3">
              Solicita tu demo gratis
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              Cuéntanos tu proyecto. Te respondemos en menos de 24 horas.
            </p>
          </div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_56px_-24px_rgba(15,15,30,0.14)] p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Nombre completo *</span>
              <input
                required
                type="text"
                value={form.nombre}
                onChange={update('nombre')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
                placeholder="Tu nombre"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Correo *</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
                placeholder="correo@negocio.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Teléfono / WhatsApp</span>
              <input
                type="tel"
                value={form.telefono}
                onChange={update('telefono')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
                placeholder="+503 0000 0000"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Nombre del negocio</span>
              <input
                type="text"
                value={form.negocio}
                onChange={update('negocio')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
                placeholder="Tu marca o empresa"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">¿Qué necesitas?</span>
              <select
                value={form.necesidad}
                onChange={update('necesidad')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15 bg-white"
              >
                <option value="">Selecciona una opción</option>
                {NEEDS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Plan de interés</span>
              <select
                value={form.plan}
                onChange={update('plan')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15 bg-white"
              >
                <option value="">Selecciona un plan</option>
                {PLANS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Cuéntanos más (opcional)</span>
              <textarea
                rows={3}
                value={form.mensaje}
                onChange={update('mensaje')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-electric focus:ring-2 focus:ring-electric/15 resize-y min-h-[88px]"
                placeholder="Objetivos, plazos, tipo de negocio..."
              />
            </label>
          </div>

          {status === 'success' && (
            <p className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              ¡Enviado! Te contactaremos pronto.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-cta w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Enviando...' : 'Enviar solicitud'}
          </button>

          <p className="text-center text-xs text-slate-400">
            ¿Prefieres el formulario detallado?{' '}
            <a
              href={SITE.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric font-semibold inline-flex items-center gap-1 hover:underline"
            >
              Abrir formulario completo
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </motion.form>
      </div>
    </section>
  )
}

export function savePlanAndGo(planName) {
  sessionStorage.setItem('wb-plan', planName)
}
