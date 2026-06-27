'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRICING_PLANS } from '@/config/site'

export function PricingSection() {
  return (
    <section className="section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-xl text-3xl md:text-4xl text-ink">Planes mensuales</h2>
          <p className="text-slate-500 mt-3">Elige el plan que mejor se adapte a tu negocio.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border p-6 ${plan.name === 'Business' ? 'border-electric bg-electric/5 shadow-lg' : 'border-slate-100 bg-white'}`}
            >
              <h3 className="font-bold text-lg text-ink">{plan.name}</h3>
              <p className="text-3xl font-extrabold text-ink mt-2">${plan.price}<span className="text-sm font-normal text-slate-400">/mes</span></p>
              <p className="text-sm text-slate-500 mt-3">{plan.description}</p>
              <Link href="/precios" className={`mt-6 w-full text-center block ${plan.name === 'Business' ? 'btn-cta' : 'btn-outline'}`}>
                Ver detalles
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const items = [
    { name: 'María G.', role: 'Restaurante', text: 'Nuestro catálogo online aumentó pedidos por WhatsApp en la primera semana.' },
    { name: 'Carlos M.', role: 'Ferretería', text: 'Profesionales, rápidos y siempre disponibles. Muy recomendados.' },
    { name: 'Ana R.', role: 'Clínica dental', text: 'La plataforma de reservas nos organizó las citas y redujo ausencias.' },
  ]

  return (
    <section className="section bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="heading-xl text-3xl md:text-4xl text-ink text-center mb-12">Lo que dicen nuestros clientes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white border border-slate-100 p-6">
              <p className="text-slate-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <p className="font-bold text-ink mt-4">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto rounded-3xl brand-gradient p-10 md:p-14 text-center text-white">
        <h2 className="heading-xl text-2xl md:text-4xl">¿Listo para impulsar tu negocio?</h2>
        <p className="text-white/80 mt-4 max-w-lg mx-auto">
          Solicita una demo personalizada por $5 o explora nuestras apps listas para usar.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/demo" className="inline-flex items-center gap-2 bg-white text-ink font-bold px-6 py-3 rounded-full hover:bg-white/90">
            Solicitar demo
          </Link>
          <a href="https://wa.me/50378227317" target="_blank" rel="noopener noreferrer" className="btn-outline border-white/30 text-white bg-white/10 hover:bg-white/20">
            WhatsApp
          </a>
        </div>
        <ul className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-white/80">
          {['Demo desde $5', 'Apps en subdominio', 'Soporte dedicado'].map((b) => (
            <li key={b} className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
