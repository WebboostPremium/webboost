'use client'

import { motion } from 'framer-motion'
import { Globe, Zap, Megaphone } from 'lucide-react'

const services = [
  { icon: Globe, title: 'Diseño web', description: 'Sitios profesionales, rápidos y optimizados para convertir visitantes en clientes.' },
  { icon: Zap, title: 'Automatización', description: 'Flujos inteligentes, WhatsApp, CRM y procesos que ahorran tiempo a tu equipo.' },
  { icon: Megaphone, title: 'Google y Meta Ads', description: 'Campañas que generan leads reales y retorno medible para tu negocio.' },
]

export function ServicesSection() {
  return (
    <section className="section bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-xl text-3xl md:text-4xl text-ink">Servicios principales</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Todo lo que necesitas para crecer en digital, en un solo equipo.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white border border-slate-100 p-6 hover:border-electric/30 transition-colors shadow-sm"
            >
              <s.icon className="w-10 h-10 text-electric mb-4" />
              <h3 className="font-bold text-lg text-ink">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
