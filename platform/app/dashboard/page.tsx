export default function DashboardPage() {
  return (
    <div>
      <h1 className="heading-xl text-2xl md:text-3xl text-ink">Hola, bienvenido a tu panel</h1>
      <p className="text-slate-500 mt-2">Gestiona propuestas, proyectos, pagos y apps desde un solo lugar.</p>
      <div className="mt-8 rounded-2xl brand-gradient p-8 text-white">
        <p className="font-bold text-lg">Próximo paso</p>
        <p className="text-white/80 mt-2 text-sm">Solicita una demo personalizada o espera la propuesta de tu proyecto.</p>
      </div>
      <p className="text-xs text-slate-400 mt-6">Módulos completos en Fase 3</p>
    </div>
  )
}
