export type SalesMaterial = {
  id: string
  title: string
  description: string
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link'
  url: string
  category: 'presentacion' | 'flyer' | 'script' | 'recursos'
}

export const SALES_MATERIALS: SalesMaterial[] = [
  {
    id: 'presentacion-webboost',
    title: 'Presentación comercial WebBoost',
    description: 'Deck PDF con servicios, precios y propuesta de valor.',
    type: 'pdf',
    url: 'https://webbooost.com/recursos/presentacion-webboost.pdf',
    category: 'presentacion',
  },
  {
    id: 'flyer-servicios',
    title: 'Flyer de servicios',
    description: 'Material visual para compartir en redes o WhatsApp.',
    type: 'image',
    url: 'https://webbooost.com/recursos/flyer-servicios.png',
    category: 'flyer',
  },
  {
    id: 'script-whatsapp',
    title: 'Script de contacto WhatsApp',
    description: 'Guion probado para primer contacto con prospectos.',
    type: 'doc',
    url: 'https://webbooost.com/recursos/script-whatsapp.pdf',
    category: 'script',
  },
  {
    id: 'guia-afiliados',
    title: 'Guía del programa de afiliados',
    description: 'Cómo funciona el CRM, comisiones y seguimiento.',
    type: 'pdf',
    url: 'https://webbooost.com/recursos/guia-afiliados.pdf',
    category: 'recursos',
  },
  {
    id: 'demo-wizard',
    title: 'Landing Demo $5',
    description: 'Enlace directo para que tus prospectos soliciten demo.',
    type: 'link',
    url: '/demo',
    category: 'recursos',
  },
]

export const MATERIAL_CATEGORIES: Record<SalesMaterial['category'], string> = {
  presentacion: 'Presentaciones',
  flyer: 'Flyers',
  script: 'Scripts de venta',
  recursos: 'Recursos',
}
