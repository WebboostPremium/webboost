export default function PageHeader({ title, subtitle, children }) {
  return (
    <section className="pt-32 md:pt-36 pb-12 md:pb-16 text-center px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="heading-xl text-4xl sm:text-5xl md:text-6xl text-ink">{title}</h1>
        {subtitle && (
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  )
}
