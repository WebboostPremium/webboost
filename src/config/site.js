export const SITE = {
  name: 'WebBooost',
  tagline: 'Impulsamos tu negocio',
  url: 'https://webbooost.com',
  locale: 'es_CR',
  email: 'webboostpremiun@gmail.com',
  formUrl: 'https://webboostpremium.github.io/formulario2.0/',
  whatsapp: 'https://wa.me/50378227317',
  facebook: 'https://www.facebook.com/share/1DmSqbHrGc/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/webbooost?igsh=aWMzd2trMzR5YXlz',
  logo: '/webbooost-logo.png',
  logoAlt: 'WebBooost — Diseño web, plataformas, sistemas y automatización digital',
  heroTitle: 'Crea tu página web de una forma nueva',
  heroHighlight: 'totalmente personalizable',
  heroDescription:
    'Pasa de una idea a un sitio listo para tu negocio. Diseñamos páginas web, plataformas completas, dashboards, catálogos online, automatizaciones y campañas en Google y Meta para que vendas 24/7.',
  description:
    'WebBooost: páginas web, plataformas completas, dashboards, catálogos online, automatización y publicidad en Google y Meta. Impulsamos tu negocio con soluciones digitales que generan clientes reales.',
  keywords: [
    'crear página web',
    'diseño web personalizado',
    'plataformas web a medida',
    'desarrollo de plataformas',
    'dashboards',
    'catálogo online',
    'automatización WhatsApp',
    'Google Ads',
    'Meta Ads',
    'WebBooost',
  ].join(', '),
}

export const NAV_LINKS = [
  { label: 'Servicios', to: '/servicios' },
  { label: 'Precios', to: '/precios' },
  { label: 'Portafolio', to: '/portafolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Afiliados', to: '/afiliados' },
]

export const RESOURCES = [
  { label: 'Formulario de solicitud', href: SITE.formUrl, external: true },
  { label: 'Proyectos en vivo', href: `${SITE.url}/#proyectos`, external: true },
  { label: 'Facebook', href: SITE.facebook, external: true },
  { label: 'Instagram', href: SITE.instagram, external: true },
]

export const SOCIALS = [
  { name: 'Facebook', href: SITE.facebook },
  { name: 'Instagram', href: SITE.instagram },
  { name: 'WhatsApp', href: SITE.whatsapp },
]
