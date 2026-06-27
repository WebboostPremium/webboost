import { DashboardShell } from '@/components/dashboard/DashboardShell'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/demos', label: 'Demos' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/clientes', label: 'Clientes' },
  { href: '/admin/propuestas', label: 'Propuestas' },
  { href: '/admin/proyectos', label: 'Proyectos' },
  { href: '/admin/apps', label: 'Apps' },
  { href: '/admin/subdominios', label: 'Subdominios' },
  { href: '/admin/pagos', label: 'Pagos' },
  { href: '/admin/solicitudes', label: 'Solicitudes' },
  { href: '/admin/afiliados', label: 'Afiliados' },
  { href: '/admin/prospectos', label: 'Prospectos' },
  { href: '/admin/comisiones', label: 'Comisiones' },
  { href: '/admin/auditoria', label: 'Auditoría' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Administración" links={links}>{children}</DashboardShell>
}
