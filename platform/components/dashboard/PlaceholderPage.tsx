export function PlaceholderPage({
  title,
  description = 'Módulo base listo. Integración completa en siguiente iteración.',
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">{title}</h1>
      <p className="text-slate-500 mt-2">{description}</p>
    </div>
  )
}
