import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { SAAS_APPS, SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Apps',
  description: 'Apps WebBooost listas para usar en subdominios personalizados.',
}

export default function AppsPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Apps WebBooost"
          subtitle={`Publica tu negocio en segundos en un subdominio como tu-negocio.${SITE.appsDomain}`}
        />
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {SAAS_APPS.map((app) => (
            <article key={app.id} className="rounded-2xl bg-white border border-slate-100 p-6 hover:border-electric/30 transition-colors">
              <h2 className="font-bold text-xl text-ink">{app.name}</h2>
              <p className="text-sm text-slate-500 mt-2">{app.description}</p>
              <p className="text-electric font-semibold mt-4">Desde ${app.priceFrom}/mes</p>
              <Link href="/precios" className="text-sm text-electric font-semibold mt-3 inline-block hover:underline">
                Ver planes →
              </Link>
            </article>
          ))}
        </div>
        <p className="text-center text-sm text-slate-400 mt-10">
          Ejemplos: saborlatino.{SITE.appsDomain} · ferreteria.{SITE.appsDomain}
        </p>
      </div>
    </div>
  )
}
