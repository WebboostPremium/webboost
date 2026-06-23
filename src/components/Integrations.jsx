const tools = [
  'WordPress', 'Shopify', 'Wix', 'Webflow', 'WhatsApp',
  'Instagram', 'Google Ads', 'Meta Ads', 'Notion', 'HubSpot',
]

export default function Integrations() {
  const row = [...tools, ...tools]
  return (
    <section className="section bg-[#fafafd] overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 text-center">
        <h2 className="heading-xl text-3xl md:text-5xl text-ink mb-3">
          Funciona con tus herramientas
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto mb-12">
          Nos integramos con las plataformas que ya usas para que todo trabaje en conjunto.
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-4 w-max animate-marquee">
          {row.map((t, i) => (
            <div
              key={i}
              className="shrink-0 px-7 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-semibold"
            >
              {t}
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#fafafd] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#fafafd] to-transparent" />
      </div>
    </section>
  )
}
