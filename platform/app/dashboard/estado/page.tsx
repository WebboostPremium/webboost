'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { getClientProjects } from '@/lib/expansion/projects'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SkeletonCard } from '@/components/ui/Skeleton'

export default function EstadoPage() {
  const { user } = useAuth()
  const [project, setProject] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getClientProjects(user.uid).then((projects) => {
      setProject((projects[0] as Record<string, unknown>) || null)
      setLoading(false)
    })
  }, [user])

  if (loading) return <SkeletonCard />

  if (!project) {
    return (
      <div>
        <h1 className="heading-xl text-2xl text-ink">Estado del proyecto</h1>
        <p className="text-slate-500 mt-4">Aún no tienes un proyecto activo.</p>
      </div>
    )
  }

  const progress = (project.progress as number) || 0
  const status = (project.status as string)?.replace(/_/g, ' ') || 'pendiente'

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Estado del proyecto</h1>
      <p className="text-slate-500 mt-1">Vista general del avance actual</p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Estado</p>
          <p className="text-xl font-bold text-ink mt-1 capitalize">{status}</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Progreso</p>
          <p className="text-xl font-bold text-electric mt-1">{progress}%</p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-100 p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Próxima etapa</p>
          <p className="text-xl font-bold text-ink mt-1">En desarrollo</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white border border-slate-100 p-6">
        <ProgressBar value={progress} label="Avance general" />
      </div>
    </div>
  )
}
