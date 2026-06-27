import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { CUSTOM_SERVICES } from '@/config/site'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Sitios web, plataformas, dashboards, CRM, catálogos y automatizaciones a medida.',
}

export default function ServiciosPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Soluciones digitales personalizadas"
          subtitle="Desarrollamos tecnología a la medida de tu negocio, desde la idea hasta la publicación."
        />
        <ul className="grid sm:grid-cols-2 gap-4 mt-10">
          {CUSTOM_SERVICES.map((service) => (
            <li key={service} className="rounded-2xl bg-white border border-slate-100 p-5 font-medium text-ink hover:border-electric/30 transition-colors">
              {service}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
