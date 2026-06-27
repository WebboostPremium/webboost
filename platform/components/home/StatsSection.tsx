'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '+150', label: 'Proyectos' },
  { value: '98%', label: 'Satisfacción' },
  { value: '+3 años', label: 'Experiencia' },
  { value: '24/7', label: 'Soporte' },
]

export function StatsSection() {
  return (
    <section className="section brand-gradient text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="text-3xl md:text-4xl font-extrabold">{s.value}</p>
            <p className="text-white/80 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
