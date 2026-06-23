import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
  {
    q: '¿Qué hace exactamente WebBooost?',
    a: 'Somos una agencia digital todo en uno. Creamos sitios web, plataformas, dashboards, catálogos online, automatizaciones y campañas de publicidad para que tu negocio se vea profesional, reciba más clientes y funcione de forma ordenada.',
  },
  {
    q: '¿Cuánto tarda en estar lista mi web?',
    a: 'Depende del plan y la complejidad, pero la mayoría de los sitios están listos entre 1 y 3 semanas. Te mantenemos informado en cada etapa del proceso.',
  },
  {
    q: '¿Necesito conocimientos técnicos?',
    a: 'Para nada. Nosotros nos encargamos de todo: diseño, desarrollo, configuración y publicación. Tú solo te enfocas en tu negocio.',
  },
  {
    q: '¿Se integra con las herramientas que ya uso?',
    a: 'Sí. Nos conectamos con WhatsApp, Instagram, Google Ads, Meta Ads, WordPress, Shopify, Webflow y muchas más para que todo trabaje en conjunto.',
  },
  {
    q: '¿Ofrecen soporte después de lanzar?',
    a: 'Claro. Todos los planes incluyen soporte y los planes superiores cuentan con atención prioritaria y dedicada 24/7, además de actualizaciones continuas.',
  },
  {
    q: '¿Hay permanencia o contratos largos?',
    a: 'No. Nuestros planes son mensuales y flexibles. Puedes mejorar, bajar o cancelar tu plan cuando lo necesites.',
  },
]

function Item({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-ink">{faq.q}</span>
        <span className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          <Plus className="w-5 h-5 text-violet-brand" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 leading-relaxed pr-8">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section className="section" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-2xl mx-auto px-5">
        <h2 id="faq-heading" className="heading-xl text-3xl md:text-5xl text-center text-ink mb-12">
          Preguntas frecuentes
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <Item key={i} faq={faq} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
