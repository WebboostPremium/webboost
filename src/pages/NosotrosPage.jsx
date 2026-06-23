import { motion } from 'framer-motion'
import { Target, Users, Zap, HeartHandshake } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Stats from '../components/Stats'
import CTA from '../components/CTA'
import { SITE } from '../config/site'

const values = [
  {
    icon: Target,
    title: 'Enfocados en resultados',
    text: 'No solo diseñamos bonito: construimos webs y plataformas que generan clientes, ventas y procesos más eficientes.',
  },
  {
    icon: Users,
    title: 'Hecho para tu negocio',
    text: 'Cada proyecto es personalizable. Desde una landing hasta plataformas completas con panel admin, CRM y automatizaciones.',
  },
  {
    icon: Zap,
    title: 'Rápidos y confiables',
    text: 'Entregamos la primera versión en días, no meses. Soporte continuo y mejoras sin complicaciones.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento real',
    text: 'Te guiamos desde la idea hasta el lanzamiento y después. WhatsApp, correo y soporte cuando lo necesites.',
  },
]

export default function NosotrosPage() {
  return (
    <>
      <PageHeader
        title="Impulsamos negocios con tecnología"
        subtitle={`${SITE.name} es tu equipo digital: diseño, desarrollo, plataformas a medida y marketing que convierte.`}
      />

      <section className="section pt-0">
        <div className="max-w-5xl mx-auto px-5 grid sm:grid-cols-2 gap-6">
          {values.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl brand-gradient flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-ink mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Stats />
      <CTA />
    </>
  )
}
