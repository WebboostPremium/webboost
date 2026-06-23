import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { savePlanAndGo } from './LeadForm'

const plans = [
  {
    name: 'Starter',
    price: '19.99',
    description: 'Para empezar con presencia online profesional.',
    features: ['1 sitio web profesional', 'Diseño responsive', 'Formulario de contacto', 'Soporte básico'],
    popular: false,
  },
  {
    name: 'Business',
    price: '34.99',
    description: 'Para negocios que quieren crecer y conectar mejor.',
    features: ['Todo de Starter', 'Sitio web avanzado', 'Integración con WhatsApp', 'Soporte prioritario'],
    popular: false,
  },
  {
    name: 'Plataforma Pro',
    price: '49.99',
    description: 'La solución completa para escalar tu operación.',
    features: ['Todo de Business', 'Dashboard cliente + admin', 'Reportes y analíticas', 'CRM básico', 'Automatizaciones', 'Soporte 24/7'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '64.99',
    description: 'Máximo rendimiento con publicidad incluida.',
    features: ['Todo de Plataforma Pro', 'Publicidad Google Ads', 'Publicidad Meta Ads', 'Estrategia mensual', 'Soporte dedicado'],
    popular: false,
  },
]

export default function Pricing({ hideIntro = false }) {
  return (
    <section id="planes" className={`section ${hideIntro ? 'pt-0' : ''}`}>
      <div className="max-w-6xl mx-auto px-5">
        {!hideIntro && (
          <>
            <h2 className="heading-xl text-3xl md:text-5xl text-center text-ink mb-3">
              Elige el plan ideal para tu negocio
            </h2>
            <p className="text-center text-slate-500 max-w-lg mx-auto mb-14">
              Planes simples, flexibles y pensados para cada etapa de crecimiento.
            </p>
          </>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-3xl p-6 flex flex-col ${
                plan.popular
                  ? 'bg-ink text-white shadow-[0_20px_50px_-18px_rgba(26,107,255,0.55)]'
                  : 'bg-white border border-slate-100 shadow-[0_8px_30px_-14px_rgba(15,15,30,0.12)]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 brand-gradient text-white text-[10px] font-bold tracking-wide px-3 py-1 rounded-full">
                  MÁS POPULAR
                </span>
              )}
              <div className="mb-4 pt-1">
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-ink'}`}>{plan.name}</h3>
                <p className={`text-xs leading-relaxed ${plan.popular ? 'text-white/60' : 'text-slate-500'}`}>{plan.description}</p>
              </div>
              <div className="mb-5">
                <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-ink'}`}>${plan.price}</span>
                <span className={plan.popular ? 'text-white/50 text-sm' : 'text-slate-400 text-sm'}>/mes</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-blue-300' : 'text-electric'}`} />
                    <span className={plan.popular ? 'text-white/85' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contacto"
                onClick={() => savePlanAndGo(plan.name)}
                className={`w-full text-center py-3 rounded-full font-bold text-sm transition-all block ${
                  plan.popular
                    ? 'bg-white text-ink hover:bg-white/90'
                    : 'brand-gradient text-white hover:opacity-90'
                }`}
              >
                Comenzar ahora
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
