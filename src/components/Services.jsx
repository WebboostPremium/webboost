import { motion } from 'framer-motion'
import { Globe, LayoutDashboard, Bot, Megaphone, ShoppingBag, Settings, Layers } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Sitios Web Profesionales',
    text: 'Diseños modernos, rápidos y responsive, optimizados para convertir visitantes en clientes.',
  },
  {
    icon: Layers,
    title: 'Plataformas Completas',
    text: 'Desarrollamos plataformas web grandes a medida: portales, CRM, reservas, inventarios y operaciones completas.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboards a Medida',
    text: 'Paneles con métricas en tiempo real para que tomes mejores decisiones de negocio.',
  },
  {
    icon: Bot,
    title: 'Automatización Inteligente',
    text: 'Flujos automáticos que ahorran tiempo, responden clientes y eliminan tareas repetitivas.',
  },
  {
    icon: Megaphone,
    title: 'Publicidad Google & Meta',
    text: 'Campañas estratégicas que atraen más clientes con el mejor retorno de inversión.',
  },
  {
    icon: ShoppingBag,
    title: 'Catálogo Online',
    text: 'Catálogos digitales interactivos para mostrar productos y recibir pedidos al instante.',
  },
  {
    icon: Settings,
    title: 'Sistemas Personalizados',
    text: 'Software a medida que se adapta exactamente a los procesos de tu empresa.',
  },
]

export default function Services({ hideIntro = false }) {
  return (
    <section id="servicios" className={`section ${hideIntro ? 'pt-0' : ''}`}>
      <div className="max-w-5xl mx-auto px-5">
        {!hideIntro && (
          <>
            <h2 className="heading-xl text-3xl md:text-5xl text-center text-ink mb-3">
              100% de tu presencia digital,{' '}
              <span className="text-brand-gradient">resuelta</span>
            </h2>
            <p className="text-center text-slate-500 max-w-xl mx-auto mb-14">
              Integramos diseño, desarrollo, sistemas y marketing para que tu empresa no solo se vea bien, sino que venda más.
            </p>
          </>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_-12px_rgba(15,15,30,0.1)] hover:shadow-[0_16px_44px_-16px_rgba(26,107,255,0.3)] hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-soft flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-violet-brand" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
