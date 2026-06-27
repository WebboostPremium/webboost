'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Mic, Star, ScanLine, Globe, LayoutDashboard, Megaphone, TrendingUp } from 'lucide-react'
import { MascotBody, MascotHandLeft, MascotHandRight } from '@/components/brand/Mascot3D'

const avatars = [
  { initials: 'MG', color: 'bg-sky-500' },
  { initials: 'CM', color: 'bg-violet-500' },
  { initials: 'AR', color: 'bg-rose-500' },
  { initials: 'RS', color: 'bg-amber-500' },
]

const tags = [
  { icon: Globe, label: 'Diseño Web' },
  { icon: LayoutDashboard, label: 'Sistemas a Medida' },
  { icon: Megaphone, label: 'Publicidad Digital' },
  { icon: TrendingUp, label: 'Resultados Reales' },
]

export function Hero() {
  return (
    <section id="inicio" className="relative pt-28 md:pt-32 pb-14 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/50 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-sky-100/60 rounded-full blur-3xl animate-blob" />
      </div>

      <div className="max-w-3xl mx-auto px-5 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="heading-xl text-4xl sm:text-5xl md:text-6xl text-ink"
        >
          Soluciones digitales para negocios que quieren crecer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          Creamos sitios web, plataformas, dashboards, catálogos online y automatizaciones para que tu negocio venda más, trabaje mejor y crezca en digital.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link href="/demo" className="btn-cta">Solicitar demo personalizada</Link>
          <Link href="/apps" className="btn-outline">Ver apps disponibles</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2" aria-hidden="true">
            {avatars.map(({ initials, color }, i) => (
              <span key={i} className={`w-7 h-7 rounded-full border-2 border-white ${color} flex items-center justify-center text-[10px] font-bold text-white`}>
                {initials}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="font-bold text-ink">4.9/5</span>
            <span className="text-slate-400">de 100+ clientes</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl mx-auto px-4 sm:px-5 mt-10 md:mt-14 pt-24 sm:pt-28 md:pt-32"
      >
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[1] mb-[-5.5rem] sm:mb-[-6rem] md:mb-[-6.5rem] pointer-events-none">
            <MascotBody />
          </div>

          <div className="relative z-[10]">
            <div className="absolute left-[6%] sm:left-[7%] top-0 -translate-y-[38%] z-[20] pointer-events-none">
              <MascotHandLeft />
            </div>
            <div className="absolute right-[5%] sm:right-[6%] top-0 -translate-y-[42%] z-[20] pointer-events-none">
              <MascotHandRight />
            </div>

            <div className="relative z-[10] flex items-center gap-2 sm:gap-3 bg-white rounded-full border border-slate-200/80 px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_8px_32px_-8px_rgba(15,15,30,0.12)]">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-600 flex-1 text-left truncate">
                Mejor agencia de diseño web y automatización
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Mic className="w-4 h-4 text-electric hidden sm:block" />
                <ScanLine className="w-4 h-4 text-electric hidden sm:block" />
                <span className="w-8 h-8 rounded-full bg-electric flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-[5] mt-4 bg-white rounded-2xl border border-slate-100 shadow-[0_20px_56px_-20px_rgba(15,15,30,0.14)] p-5 md:p-6 text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">W</span>
            <div className="min-w-0">
              <p className="text-sm text-slate-800 font-semibold leading-none">Sabor Latino Restaurante</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">saborlatino.wboost.app</p>
            </div>
          </div>
          <p className="text-lg md:text-xl text-electric font-semibold leading-snug">Sabor Latino — Catálogo online y pedidos por WhatsApp</p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Menú digital, promociones y pedidos directos. Tu negocio visible en Google y listo para vender 24/7.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
            {tags.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-sm">
                <Icon className="w-3.5 h-3.5 text-electric" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
