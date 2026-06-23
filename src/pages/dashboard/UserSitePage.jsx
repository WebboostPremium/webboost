import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getUserSites, SITE_STATUS } from '../../lib/sites'

const statusLabel = {
  [SITE_STATUS.PENDING]: 'En revisión',
  [SITE_STATUS.BUILDING]: 'En construcción',
  [SITE_STATUS.ACTIVE]: 'Activo',
  [SITE_STATUS.PAUSED]: 'Pausado',
}

export default function UserSitePage() {
  const { user } = useAuth()
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserSites(user.uid).then(setSites).finally(() => setLoading(false))
  }, [user])

  return (
    <DashboardLayout variant="user">
      <h1 className="heading-xl text-2xl md:text-3xl text-ink mb-2">Mi sitio web</h1>
      <p className="text-slate-500 mb-8">Proyectos que WebBooost gestiona para ti.</p>

      {loading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !sites.length ? (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center">
          <p className="text-slate-600 mb-4">Aún no tienes un sitio registrado en la plataforma.</p>
          <Link to="/contacto" className="btn-cta">Comenzar mi proyecto</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <div key={site.id} className="rounded-2xl bg-white border border-slate-100 p-6">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <h3 className="font-bold text-lg text-ink">{site.name}</h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-electric/10 text-electric">
                  {statusLabel[site.status] || site.status}
                </span>
              </div>
              <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">Plan</dt>
                  <dd className="font-medium">{site.plan}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Estado</dt>
                  <dd className="font-medium">{statusLabel[site.status]}</dd>
                </div>
                {site.url && (
                  <div className="sm:col-span-2">
                    <dt className="text-slate-400">URL</dt>
                    <dd>
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-electric hover:underline inline-flex items-center gap-1">
                        {site.url} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </dd>
                  </div>
                )}
                {site.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-slate-400">Notas del equipo</dt>
                    <dd className="text-slate-600">{site.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
