import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

const projects = [
  { name: 'Clínica Dental', type: 'Sitio Web + Reservas', tag: 'Top 1', color: 'from-cyan-400 to-blue-500' },
  { name: 'Ferretería Industrial', type: 'Catálogo Online', tag: 'Top 2', color: 'from-orange-400 to-amber-500' },
  { name: 'Restaurante Bari', type: 'Sitio Web + Menú', tag: 'Top 1', color: 'from-rose-400 to-red-500' },
  { name: 'Logística Express', type: 'Dashboard + Tracking', tag: 'Top 3', color: 'from-indigo-400 to-violet-500' },
  { name: 'Inmobiliaria Plus', type: 'Plataforma + CRM', tag: 'Top 1', color: 'from-emerald-400 to-teal-500' },
  { name: 'Gimnasio FitZone', type: 'Web + Automatización', tag: 'Top 2', color: 'from-fuchsia-400 to-purple-500' },
]

export default function Portfolio({ hideIntro = false }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  return (
    <section id="portafolio" className={`section bg-[#fafafd] overflow-hidden ${hideIntro ? 'pt-0' : ''}`}>
      <div className="max-w-6xl mx-auto px-5">
        {!hideIntro && (
          <div className="text-center mb-12">
            <h2 className="heading-xl text-3xl md:text-5xl text-ink mb-3">
              Proyectos que rankean y venden
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Hemos ayudado a negocios de todos los sectores a crecer en Google y redes.
            </p>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 hidden md:flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 hidden md:flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div ref={ref} className="flex gap-5 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="snap-start shrink-0 w-72 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_-16px_rgba(15,15,30,0.15)] group"
              >
                <div className={`relative h-40 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <span className="absolute top-3 left-3 text-[11px] font-bold bg-white/90 text-ink px-2.5 py-1 rounded-full">{p.tag}</span>
                  <span className="text-white/90 text-3xl font-extrabold tracking-tight">{p.name.charAt(0)}</span>
                  <ArrowUpRight className="absolute top-3 right-3 w-5 h-5 text-white/80 group-hover:scale-125 transition-transform" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-ink">{p.name}</h3>
                  <p className="text-sm text-violet-brand font-medium">{p.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
