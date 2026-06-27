export const SITE = {
  name: 'WebBooost',
  tagline: 'Impulsamos tu negocio',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://webbooost.com',
  domain: 'webbooost.com',
  appsDomain: 'wboost.app',
  locale: 'es_CR',
  email: 'webboostpremiun@gmail.com',
  whatsapp: 'https://wa.me/50378227317',
  facebook: 'https://www.facebook.com/share/1DmSqbHrGc/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/webbooost?igsh=aWMzd2trMzR5YXlz',
  logo: '/webbooost-logo.png',
  logoAlt: 'WebBooost — Diseño web, plataformas, sistemas y automatización digital',
  demoPrice: 5,
  currency: 'USD',
  description:
    'WebBooost: sitios web, plataformas completas, dashboards, catálogos online, automatización y publicidad digital. Impulsamos tu negocio con soluciones que generan clientes reales.',
} as const

export const NAV_LINKS = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Apps', href: '/apps' },
  { label: 'Precios', href: '/precios' },
  { label: 'Portafolio', href: '/portafolio' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Afiliados', href: '/afiliados' },
] as const

export const CUSTOM_SERVICES = [
  'Sitios web profesionales',
  'Plataformas completas',
  'Dashboards',
  'CRM',
  'Catálogos online',
  'Automatizaciones',
  'Publicidad digital',
  'Sistemas a medida',
] as const

export const SAAS_APPS = [
  { id: 'catalog', name: 'Catálogo Online', description: 'Muestra productos y recibe pedidos por WhatsApp.', priceFrom: 19.99, icon: 'ShoppingBag' },
  { id: 'bookings', name: 'Sistema de Reservas', description: 'Agenda citas y confirma reservas automáticamente.', priceFrom: 24.99, icon: 'Calendar' },
  { id: 'business_page', name: 'Página de Negocio', description: 'Presencia digital profesional en minutos.', priceFrom: 14.99, icon: 'Store' },
  { id: 'crm', name: 'CRM Simple', description: 'Gestiona clientes y seguimiento comercial.', priceFrom: 29.99, icon: 'Users' },
  { id: 'dashboard', name: 'Dashboard Básico', description: 'Métricas y control de tu operación.', priceFrom: 34.99, icon: 'LayoutDashboard' },
  { id: 'menu', name: 'Menú Digital', description: 'Menú interactivo para restaurantes y cafés.', priceFrom: 19.99, icon: 'UtensilsCrossed' },
  { id: 'whatsapp_orders', name: 'Pedidos por WhatsApp', description: 'Catálogo + checkout directo a WhatsApp.', priceFrom: 19.99, icon: 'MessageCircle' },
] as const

export const PRICING_PLANS = [
  { name: 'Starter', price: 19.99, description: 'Ideal para emprendedores que inician en digital.' },
  { name: 'Business', price: 34.99, description: 'Para negocios que necesitan más funciones y soporte.' },
  { name: 'Plataforma Pro', price: 49.99, description: 'Plataforma completa con integraciones avanzadas.' },
  { name: 'Premium', price: 64.99, description: 'Solución premium con prioridad y personalización.' },
] as const

export const SOCIALS = [
  { name: 'Facebook' as const, href: SITE.facebook },
  { name: 'Instagram' as const, href: SITE.instagram },
  { name: 'WhatsApp' as const, href: SITE.whatsapp },
]

export const RESOURCES = [
  { label: 'Solicitar demo', href: '/demo', external: false },
  { label: 'Ver apps', href: '/apps', external: false },
  { label: 'Facebook', href: SITE.facebook, external: true },
  { label: 'Instagram', href: SITE.instagram, external: true },
]
