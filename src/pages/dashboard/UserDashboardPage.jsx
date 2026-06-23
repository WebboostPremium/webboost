import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Globe, Bell, ArrowRight, Plus } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getUserSites, SITE_STATUS } from '../../lib/sites'
import { getUserNotifications } from '../../lib/notifications'

const statusLabel = {
  [SITE_STATUS.PENDING]: { text: 'En revisión', color: 'bg-amber-100 text-amber-700' },
  [SITE_STATUS.BUILDING]: { text: 'En construcción', color: 'bg-blue-100 text-blue-700' },
  [SITE_STATUS.ACTIVE]: { text: 'Activo', color: 'bg-emerald-100 text-emerald-700' },
  [SITE_STATUS.PAUSED]: { text: 'Pausado', color: 'bg-slate-100 text-slate-600' },
}

export default function UserDashboardPage() {
  const { user } = useAuth()
  const [sites, setSites] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([getUserSites(user.uid), getUserNotifications(user.uid)])
      .then(([s, n]) => {
        setSites(s)
        setNotifications(n)
      })
      .finally(() => setLoading(false))
  }, [user])

  const unread = notifications.filter((n) => !n.read).length
  const activeSite = sites.find((s) => s.status === SITE_STATUS.ACTIVE)

  return (
    <DashboardLayout variant="user">
      <div className="mb-8">
        <h1 className="heading-xl text-2xl md:text-3xl text-ink">Hola, bienvenido a tu panel</h1>
        <p className="text-slate-500 mt-2">Gestiona tu proyecto, revisa avisos y da el siguiente paso con WebBooost.</p>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {!sites.length && (
            <div className="rounded-3xl brand-gradient p-8 md:p-10 text-white mb-8">
              <Rocket className="w-10 h-10 mb-4 opacity-90" />
              <h2 className="text-xl md:text-2xl font-bold mb-2">Comienza tu proyecto</h2>
              <p className="text-white/80 mb-6 max-w-lg">
                Aún no tienes un sitio web con nosotros. Cuéntanos tu idea y te ayudamos a lanzarlo.
              </p>
              <Link to="/contacto" className="inline-flex items-center gap-2 bg-white text-ink font-bold px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
                Comenzar ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link to="/panel/sitio" className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-electric/30 transition-colors">
              <Globe className="w-8 h-8 text-electric mb-3" />
              <p className="font-bold text-ink">{sites.length ? `${sites.length} sitio(s)` : 'Sin sitio'}</p>
              <p className="text-sm text-slate-500 mt-1">Ver detalles de tu web</p>
            </Link>
            <Link to="/panel/notificaciones" className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-electric/30 transition-colors">
              <Bell className="w-8 h-8 text-electric mb-3" />
              <p className="font-bold text-ink">{unread ? `${unread} sin leer` : 'Notificaciones'}</p>
              <p className="text-sm text-slate-500 mt-1">Avisos del equipo WebBooost</p>
            </Link>
            <Link to="/contacto" className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-electric/30 transition-colors">
              <Plus className="w-8 h-8 text-electric mb-3" />
              <p className="font-bold text-ink">Nuevo proyecto</p>
              <p className="text-sm text-slate-500 mt-1">Solicitar otro servicio</p>
            </Link>
          </div>

          {activeSite && (
            <div className="rounded-2xl bg-white border border-slate-100 p-6">
              <h3 className="font-bold text-ink mb-4">Tu sitio activo</h3>
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <p className="font-semibold">{activeSite.name}</p>
                  {activeSite.url && (
                    <a href={activeSite.url} target="_blank" rel="noopener noreferrer" className="text-sm text-electric hover:underline">
                      {activeSite.url}
                    </a>
                  )}
                  <p className="text-xs text-slate-400 mt-1">Plan: {activeSite.plan}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusLabel[activeSite.status]?.color}`}>
                  {statusLabel[activeSite.status]?.text}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
