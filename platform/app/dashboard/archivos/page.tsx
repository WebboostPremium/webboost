'use client'

import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { listClientAssets } from '@/lib/expansion/tickets'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ArchivosPage() {
  const { user } = useAuth()
  const [assets, setAssets] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    if (!user) return
    listClientAssets(user.uid).then(setAssets)
  }, [user])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Mis archivos</h1>
      <p className="text-slate-500 mt-1">Contratos, facturas, logos y recursos de tu proyecto.</p>

      {!assets.length ? (
        <div className="mt-8">
          <EmptyState icon={FileText} title="Sin archivos" description="Cuando subas o recibas archivos, aparecerán aquí." />
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {assets.map((a) => (
            <li key={a.id as string} className="rounded-xl bg-white border px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-medium">{a.name as string}</span>
              <a href={a.url as string} target="_blank" rel="noopener noreferrer" className="text-electric flex items-center gap-1 text-sm">
                <Download className="w-4 h-4" /> Descargar
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
