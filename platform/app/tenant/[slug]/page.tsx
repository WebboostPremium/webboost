export default async function TenantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="heading-xl text-2xl text-ink">App: {slug}</h1>
        <p className="text-slate-500 mt-2">Catálogo multi-tenant — Fase 5</p>
      </div>
    </div>
  )
}
