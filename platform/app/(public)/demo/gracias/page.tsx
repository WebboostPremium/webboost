import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default async function DemoGraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  return (
    <div className="pt-32 pb-20 px-5 text-center max-w-lg mx-auto">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
      <h1 className="heading-xl text-3xl text-ink">¡Solicitud recibida!</h1>
      <p className="text-slate-500 mt-4">
        Tu configuración de demo ha sido guardada. Completa el pago para que nuestro equipo revise tu proyecto.
      </p>
      {id && <p className="text-xs text-slate-400 mt-2">Referencia: {id}</p>}
      <Link href="/dashboard" className="btn-cta mt-8 inline-flex">Ir a mi panel</Link>
    </div>
  )
}
