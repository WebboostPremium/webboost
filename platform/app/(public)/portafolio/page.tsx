import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Portafolio',
  description: 'Proyectos y trabajos realizados por WebBooost.',
}

export default function PortafolioPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Portafolio" subtitle="Algunos proyectos que hemos impulsado." />
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {['Sabor Latino — Catálogo', 'Clínica Sonríe — Reservas', 'Intense Gym — Landing', 'Ferretería Central — Catálogo'].map((p) => (
            <div key={p} className="rounded-2xl bg-white border border-slate-100 p-6 aspect-video flex items-end">
              <p className="font-semibold text-ink">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
