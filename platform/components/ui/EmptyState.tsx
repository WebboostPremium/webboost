import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-electric/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-electric" />
      </div>
      <h3 className="font-bold text-ink">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
