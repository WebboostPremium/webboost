'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { getClientProjects, getProjectTimeline, initProjectTimeline } from '@/lib/expansion/projects'
import { ProjectTimeline } from '@/components/expansion/ProjectTimeline'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { ProjectTimelineEntry } from '@/types/expansion'

export default function ProyectoPage() {
  const { user } = useAuth()
  const [project, setProject] = useState<Record<string, unknown> | null>(null)
  const [timeline, setTimeline] = useState<ProjectTimelineEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getClientProjects(user.uid).then(async (projects) => {
      const p = projects[0] as Record<string, unknown> | undefined
      if (p) {
        setProject(p)
        const tl = await initProjectTimeline(p.id as string)
        setTimeline(tl || [])
      }
      setLoading(false)
    })
  }, [user])

  if (loading) return <SkeletonCard />

  if (!project) {
    return (
      <div>
        <h1 className="heading-xl text-2xl text-ink">Mi proyecto</h1>
        <p className="text-slate-500 mt-4">Aún no tienes un proyecto activo. Cuando aceptes una propuesta, aparecerá aquí.</p>
      </div>
    )
  }

  const progress = (project.progress as number) || 0

  return (
    <div>
      <h1 className="heading-xl text-2xl md:text-3xl text-ink">{project.title as string}</h1>
      <p className="text-slate-500 mt-1 capitalize">Estado: {(project.status as string)?.replace(/_/g, ' ')}</p>

      <div className="mt-8 rounded-2xl bg-white border border-slate-100 p-6">
        <ProgressBar value={progress} label="Progreso del proyecto" />
        <div className="grid sm:grid-cols-3 gap-4 mt-6 text-sm">
          <div><p className="text-slate-400">Inicio</p><p className="font-medium">—</p></div>
          <div><p className="text-slate-400">Entrega estimada</p><p className="font-medium">—</p></div>
          <div><p className="text-slate-400">Próxima etapa</p><p className="font-medium text-electric">En desarrollo</p></div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white border border-slate-100 p-6">
        <h2 className="font-bold text-ink mb-6">Línea de tiempo</h2>
        <ProjectTimeline entries={timeline} />
      </div>
    </div>
  )
}
