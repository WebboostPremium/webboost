import { PlaceholderPage } from '@/components/dashboard/PlaceholderPage'
import { SITE } from '@/config/site'

export default function Page() {
  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Soporte</h1>
      <p className="text-slate-500 mt-2">¿Necesitas ayuda? Escríbenos por WhatsApp.</p>
      <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-cta mt-6 inline-flex">WhatsApp</a>
    </div>
  )
}
