import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { PRICING_PLANS } from '@/config/site'

export const metadata: Metadata = {
  title: 'Precios',
  description: 'Planes mensuales Starter, Business, Plataforma Pro y Premium.',
}

export default function PreciosPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-5xl mx-auto">
        <PageHeader title="Precios" subtitle="Suscripción mensual flexible. Escala cuando tu negocio crezca." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="font-bold text-lg">{plan.name}</h2>
              <p className="text-3xl font-extrabold mt-2">${plan.price}<span className="text-sm font-normal text-slate-400">/mes</span></p>
              <p className="text-sm text-slate-500 mt-3">{plan.description}</p>
              <Link href="/demo" className="btn-cta w-full mt-6 text-center block text-sm">
                Comenzar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
