'use client'

import { Check, Clock, Circle } from 'lucide-react'
import type { ProjectTimelineEntry } from '@/types/expansion'

export function ProjectTimeline({ entries }: { entries: ProjectTimelineEntry[] }) {
  if (!entries.length) {
    return <p className="text-sm text-slate-500">Aún no hay etapas registradas.</p>
  }

  return (
    <ul className="space-y-0">
      {entries.map((entry, i) => (
        <li key={entry.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <StageIcon status={entry.status} />
            {i < entries.length - 1 && <div className="w-0.5 flex-1 min-h-[2rem] bg-slate-200 my-1" />}
          </div>
          <div className="pb-6 flex-1">
            <p className={`font-semibold ${entry.status === 'completed' ? 'text-ink' : entry.status === 'in_progress' ? 'text-electric' : 'text-slate-400'}`}>
              {entry.label}
            </p>
            {entry.comment && <p className="text-sm text-slate-500 mt-1">{entry.comment}</p>}
            {entry.responsible && <p className="text-xs text-slate-400 mt-1">Responsable: {entry.responsible}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

function StageIcon({ status }: { status: ProjectTimelineEntry['status'] }) {
  if (status === 'completed') return <Check className="w-5 h-5 text-emerald-500" />
  if (status === 'in_progress') return <Clock className="w-5 h-5 text-electric" />
  return <Circle className="w-5 h-5 text-slate-300" />
}
