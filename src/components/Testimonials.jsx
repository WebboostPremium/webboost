const testimonials = [
  { name: 'María González', loc: 'Clínica Sonrisa', date: 'Dic 2025', text: 'WebBooost transformó nuestra clínica. Ahora recibimos reservas online todos los días y el sitio se ve increíblemente profesional.' },
  { name: 'Carlos Mendoza', loc: 'FerreMax Industrial', date: 'Nov 2025', text: 'El catálogo digital nos permitió llegar a clientes en todo el país. El dashboard de pedidos nos ahorra horas cada semana.' },
  { name: 'Ana Rodríguez', loc: 'Restaurante Bari', date: 'Dic 2025', text: 'Desde que lanzamos el sitio, las reservas aumentaron un 80%. El soporte siempre está disponible cuando lo necesitamos.' },
  { name: 'Roberto Silva', loc: 'Logística Express', date: 'Oct 2025', text: 'La plataforma de tracking y el CRM integrado cambiaron por completo nuestra operación. Recomendado al 100%.' },
  { name: 'Lucía Fernández', loc: 'Inmobiliaria Plus', date: 'Feb 2026', text: 'Capturamos leads automáticamente y se organizan solos en el panel. Vendemos más sin esfuerzo extra.' },
  { name: 'Diego Torres', loc: 'Gimnasio FitZone', date: 'Ene 2026', text: 'Las automatizaciones de WhatsApp nos recuperaron clientes inactivos. La inversión se pagó en semanas.' },
  { name: 'Paula Ramírez', loc: 'Boutique Aura', date: 'Dic 2025', text: 'Mi tienda online por fin vende mientras duermo. El equipo entendió mi marca a la perfección.' },
  { name: 'Andrés Castro', loc: 'Estudio Legal CR', date: 'Nov 2025', text: 'Profesionales, rápidos y atentos. Nuestra web transmite la seriedad que el despacho necesitaba.' },
]

export default function Testimonials() {
  return (
    <section id="nosotros" className="section bg-[#fafafd]">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="heading-xl text-3xl md:text-5xl text-center text-ink mb-3">
          Usado por quienes crecen rápido
        </h2>
        <p className="text-center text-slate-500 mb-14">+100 negocios confían en WebBooost</p>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid mb-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_-16px_rgba(15,15,30,0.12)]"
            >
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-ink">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.loc}</p>
                </div>
                <span className="text-xs text-slate-300">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
