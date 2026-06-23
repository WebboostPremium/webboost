import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Percent, Share2, Wallet, TrendingUp } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { SITE } from '../config/site'

const perks = [
  { icon: Percent, title: 'Comisión por referido', text: 'Gana por cada cliente que traigas y contrate un plan con WebBooost.' },
  { icon: Share2, title: 'Material listo', text: 'Te damos enlaces, textos y recursos para promocionar nuestros servicios.' },
  { icon: Wallet, title: 'Pagos transparentes', text: 'Seguimiento claro de tus referidos y comisiones sin letra pequeña.' },
  { icon: TrendingUp, title: 'Crece con nosotros', text: 'Ideal para freelancers, agencias, influencers y emprendedores digitales.' },
]

export default function AfiliadosPage() {
  return (
    <>
      <PageHeader
        title="Programa de afiliados WebBooost"
        subtitle="Recomienda páginas web, plataformas y automatización. Gana comisiones ayudando a otros negocios a crecer en línea."
      />

      <section className="section pt-0">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {perks.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-slate-100 bg-white p-6"
              >
                <Icon className="w-8 h-8 text-electric mb-3" />
                <h3 className="font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-3xl brand-gradient p-8 md:p-12 text-center text-white">
            <h2 className="heading-xl text-2xl md:text-4xl mb-4">¿Quieres ser afiliado?</h2>
            <p className="text-white/85 max-w-lg mx-auto mb-8">
              Regístrate, cuéntanos cómo promocionarías WebBooost y te contactamos con los detalles del programa.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/registro" className="inline-flex px-7 py-3.5 bg-white text-ink font-bold rounded-full hover:bg-white/90 transition-all">
                Crear cuenta
              </Link>
              <a
                href={`mailto:${SITE.email}?subject=Programa%20de%20afiliados%20WebBooost`}
                className="inline-flex px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Escribir por correo
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
