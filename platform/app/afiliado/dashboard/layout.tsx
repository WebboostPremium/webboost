import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { AFFILIATE_NAV } from '@/config/navigation'

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Dashboard Afiliado" links={[...AFFILIATE_NAV]}>{children}</DashboardShell>
}
