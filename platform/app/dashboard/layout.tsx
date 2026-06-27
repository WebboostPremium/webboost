import { DashboardShell } from '@/components/dashboard/DashboardShell'

const links = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/propuesta', label: 'Mi propuesta' },
  { href: '/dashboard/proyecto', label: 'Mi proyecto' },
  { href: '/dashboard/apps', label: 'Mis apps' },
  { href: '/dashboard/pagos', label: 'Mis pagos' },
  { href: '/dashboard/archivos', label: 'Mis archivos' },
  { href: '/dashboard/solicitudes', label: 'Solicitudes' },
  { href: '/dashboard/notificaciones', label: 'Notificaciones' },
  { href: '/dashboard/soporte', label: 'Soporte' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Tu panel" links={links}>{children}</DashboardShell>
}
