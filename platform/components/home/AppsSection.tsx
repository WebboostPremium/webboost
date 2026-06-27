'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Calendar, Store, LayoutDashboard } from 'lucide-react'
import { SAAS_APPS } from '@/config/site'

const icons: Record<string, typeof ShoppingBag> = {
  catalog: ShoppingBag,
  bookings: Calendar,
  business_page: Store,
  crm: LayoutDashboard,
  dashboard: LayoutDashboard,
  menu: Store,
  whatsapp_orders: ShoppingBag,
}

export function AppsSection() {
  const featured = SAAS_APPS.slice(0, 4)

  return (
    <section className="section bg-indigo-soft/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-xl text-3xl md:text-4xl text-ink">Apps WebBooost</h2>
          <p className="text-slate-500 mt-3">Listas para usar, en tu subdominio, con suscripción mensual.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((app, i) => {
            const Icon = icons[app.id] || ShoppingBag
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-electric/30 transition-colors"
              >
                <Icon className="w-8 h-8 text-electric mb-3" />
                <h3 className="font-bold text-ink">{app.name}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{app.description}</p>
                <p className="text-sm font-semibold text-electric mt-3">Desde ${app.priceFrom}/mes</p>
              </motion.div>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <Link href="/apps" className="btn-outline">Ver todas las apps</Link>
        </div>
      </div>
    </section>
  )
}
