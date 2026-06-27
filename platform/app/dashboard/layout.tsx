import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { CLIENT_NAV } from '@/config/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Dashboard Cliente" links={[...CLIENT_NAV]}>{children}</DashboardShell>
}
