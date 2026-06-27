export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="text-center max-w-2xl mx-auto">
      <h1 className="heading-xl text-3xl md:text-4xl text-ink">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-3 text-base leading-relaxed">{subtitle}</p>}
    </header>
  )
}
