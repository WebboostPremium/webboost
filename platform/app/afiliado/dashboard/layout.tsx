import { DashboardShell } from '@/components/dashboard/DashboardShell'

const links = [
  { href: '/afiliado/dashboard', label: 'Resumen' },
  { href: '/afiliado/dashboard/prospectos', label: 'Mis Prospectos' },
  { href: '/afiliado/dashboard/comisiones', label: 'Comisiones' },
  { href: '/afiliado/dashboard/recordatorios', label: 'Recordatorios' },
]

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Panel afiliado" links={links}>{children}</DashboardShell>
}
