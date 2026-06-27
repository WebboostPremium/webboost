import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos para tu proyecto digital.',
}

export default function ContactoPage() {
  return (
    <div className="pt-28 pb-20 px-5">
      <div className="max-w-lg mx-auto">
        <PageHeader title="Contacto" subtitle="Escríbenos y te respondemos pronto." />
        <form className="mt-8 space-y-4 rounded-2xl bg-white border border-slate-100 p-6">
          <input required placeholder="Nombre" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          <input required type="email" placeholder="Correo" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          <textarea required placeholder="Mensaje" rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          <button type="submit" className="btn-cta w-full">Enviar mensaje</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          O escríbenos por{' '}
          <a href={SITE.whatsapp} className="text-electric font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}
