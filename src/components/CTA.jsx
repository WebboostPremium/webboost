import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import Mascot3D from './Mascot3D'
import { SITE } from '../config/site'

export default function CTA() {
  return (
    <section className="section pt-0">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] overflow-hidden brand-gradient px-6 py-14 md:py-20 text-center"
        >
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-black/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex justify-center mb-2">
              <Mascot3D size="md" />
            </div>

            <h2 className="heading-xl text-3xl md:text-5xl text-white mb-4">
              ¿Listo para llevar tu negocio al siguiente nivel?
            </h2>
            <p className="text-white/80 text-lg max-w-lg mx-auto mb-8">
              Plataformas completas, webs que venden y automatización real. Empieza con una demo gratis.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contacto" className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-ink font-bold rounded-full hover:bg-white/90 transition-all shadow-lg">
                Solicitar demo gratis
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
