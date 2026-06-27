import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthProvider'
import { ToastProvider } from '@/components/ui/ToastProvider'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://webbooost.com'),
  title: {
    default: 'WebBooost — Soluciones digitales para negocios',
    template: '%s | WebBooost',
  },
  description:
    'Sitios web, plataformas, dashboards, catálogos online, automatizaciones y apps listas para usar. Impulsamos tu negocio.',
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    siteName: 'WebBooost',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={plusJakarta.variable}>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
