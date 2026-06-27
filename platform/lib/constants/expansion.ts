import type { FollowUpActionType, ProspectStatus } from '@/types/expansion'

export const PROSPECT_STATUSES: { value: ProspectStatus; label: string }[] = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'reunion_programada', label: 'Reunión programada' },
  { value: 'cotizacion_enviada', label: 'Cotización enviada' },
  { value: 'negociacion', label: 'Negociación' },
  { value: 'pendiente_respuesta', label: 'Pendiente de respuesta' },
  { value: 'venta_cerrada', label: 'Venta cerrada' },
  { value: 'proyecto_iniciado', label: 'Proyecto iniciado' },
  { value: 'no_interesado', label: 'No interesado' },
  { value: 'cancelado', label: 'Cancelado' },
]

export const FOLLOW_UP_ACTIONS: { value: FollowUpActionType; label: string }[] = [
  { value: 'llamada', label: 'Llamada realizada' },
  { value: 'mensaje', label: 'Mensaje enviado' },
  { value: 'reunion', label: 'Reunión' },
  { value: 'cotizacion', label: 'Cotización enviada' },
  { value: 'cliente_respondio', label: 'Cliente respondió' },
  { value: 'cliente_interesado', label: 'Cliente interesado' },
  { value: 'cliente_rechazo', label: 'Cliente rechazó' },
  { value: 'cliente_pospuso', label: 'Cliente pospuso decisión' },
  { value: 'seguimiento', label: 'Seguimiento realizado' },
]

export const DEMO_STYLES = ['Minimalista', 'Moderno', 'Corporativo', 'Premium', 'Tecnológico', 'Elegante', 'Creativo', 'Oscuro', 'Claro']

export const DEMO_SECTIONS = [
  'Inicio', 'Nosotros', 'Servicios', 'Productos', 'Catálogo', 'Galería', 'Portafolio', 'Blog',
  'Contacto', 'WhatsApp', 'Reservas', 'Agenda', 'Tienda', 'Preguntas frecuentes', 'Equipo', 'Testimonios',
]

export const DEMO_FEATURES = [
  'WhatsApp', 'Chat', 'Agenda', 'Reservas', 'Pagos', 'Login', 'Panel administrativo', 'Catálogo Digital',
  'Integración Facebook', 'Instagram', 'Google Maps', 'Formularios', 'Correo empresarial', 'Blog', 'SEO',
]

export const COLOR_PRESETS = [
  { id: 'electric', name: 'Azul eléctrico', colors: ['#1A6BFF', '#0A4FD6'] },
  { id: 'emerald', name: 'Verde moderno', colors: ['#10B981', '#047857'] },
  { id: 'violet', name: 'Violeta premium', colors: ['#7C3AED', '#5B21B6'] },
  { id: 'rose', name: 'Rosa elegante', colors: ['#F43F5E', '#BE123C'] },
  { id: 'amber', name: 'Ámbar cálido', colors: ['#F59E0B', '#B45309'] },
  { id: 'slate', name: 'Gris corporativo', colors: ['#475569', '#1E293B'] },
]

export const DEFAULT_COMMISSION_PERCENT = 10

export const PROJECT_STAGES = [
  'Información recibida',
  'Diseño aprobado',
  'Desarrollo iniciado',
  'Backend',
  'Integraciones',
  'Pruebas',
  'Publicación',
]
