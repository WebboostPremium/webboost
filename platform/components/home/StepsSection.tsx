'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Palette, Rocket } from 'lucide-react'

const steps = [
  { icon: MessageSquare, title: 'Cuéntanos', description: 'Comparte tu idea, negocio y objetivos. Te guiamos desde el primer paso.' },
  { icon: Palette, title: 'Creamos', description: 'Diseñamos y desarrollamos tu solución digital a medida o activamos tu app.' },
  { icon: Rocket, title: 'Publica y crece', description: 'Lanzamos, optimizamos y te acompañamos para que vendas más.' },
]

export function StepsSection() {
  return (
    <section className="section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-xl text-3xl md:text-4xl text-ink">Cómo funciona</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-xl text-ink">{step.title}</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
