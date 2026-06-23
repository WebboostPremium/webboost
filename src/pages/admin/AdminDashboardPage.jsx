import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Globe, FileText, Bell } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listAllUsers } from '../../lib/users'
import { listAllSites } from '../../lib/sites'
import { listAllPosts } from '../../lib/blog'
import { listAllNotifications } from '../../lib/notifications'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, sites: 0, posts: 0, notifications: 0 })

  useEffect(() => {
    Promise.all([listAllUsers(), listAllSites(), listAllPosts(), listAllNotifications()]).then(
      ([users, sites, posts, notifications]) => {
        setStats({
          users: users.length,
          sites: sites.length,
          posts: posts.filter((p) => p.published).length,
          notifications: notifications.length,
        })
      },
    )
  }, [])

  const cards = [
    { label: 'Usuarios', value: stats.users, to: '/admin/usuarios', icon: Users },
    { label: 'Sitios web', value: stats.sites, to: '/admin/sitios', icon: Globe },
    { label: 'Posts publicados', value: stats.posts, to: '/admin/blog', icon: FileText },
    { label: 'Notificaciones enviadas', value: stats.notifications, to: '/admin/notificaciones', icon: Bell },
  ]

  return (
    <DashboardLayout variant="admin">
      <h1 className="heading-xl text-2xl md:text-3xl text-ink mb-2">Panel de administración</h1>
      <p className="text-slate-500 mb-8">Control total de usuarios, sitios, blog y avisos.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, to, icon: Icon }) => (
          <Link key={to} to={to} className="rounded-2xl bg-white border border-slate-100 p-5 hover:border-electric/30 transition-colors">
            <Icon className="w-8 h-8 text-electric mb-3" />
            <p className="text-3xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
