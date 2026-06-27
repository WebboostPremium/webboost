import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Afiliados',
  description: 'Programa de afiliados WebBooost. Gana comisiones por referir clientes.',
}

export default function AfiliadosPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Programa de afiliados"
          subtitle="Refiere clientes y gana comisiones por cada conversión."
        />
        <ul className="mt-8 space-y-3 text-slate-600">
          <li className="rounded-xl bg-white border border-slate-100 px-4 py-3">Código de referido único</li>
          <li className="rounded-xl bg-white border border-slate-100 px-4 py-3">Panel con clientes referidos y comisiones</li>
          <li className="rounded-xl bg-white border border-slate-100 px-4 py-3">Pagos de comisión transparentes</li>
        </ul>
        <Link href="/registro" className="btn-cta mt-8 inline-flex">
          Registrarme como afiliado
        </Link>
      </div>
    </div>
  )
}
