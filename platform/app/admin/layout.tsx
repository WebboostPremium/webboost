import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { ADMIN_NAV } from '@/config/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Dashboard Administrador" links={[...ADMIN_NAV]}>{children}</DashboardShell>
}
