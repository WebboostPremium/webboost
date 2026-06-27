import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce WebBooost y nuestra propuesta de valor.',
}

export default function NosotrosPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Quiénes somos" subtitle={SITE.tagline} />
        <div className="prose prose-slate max-w-none mt-8 text-slate-600 leading-relaxed space-y-4">
          <p>
            En WebBooost ayudamos a negocios a crecer con soluciones digitales reales: sitios web, plataformas, apps SaaS y automatizaciones que generan resultados.
          </p>
          <p>
            Combinamos diseño premium, tecnología moderna y acompañamiento cercano para que cada cliente tenga una experiencia clara desde la demo hasta la publicación.
          </p>
        </div>
      </div>
    </div>
  )
}
