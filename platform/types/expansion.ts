import type { Timestamp } from 'firebase/firestore'

export type InterestLevel = 'alto' | 'medio' | 'bajo'

export type ProspectStatus =
  | 'nuevo'
  | 'contactado'
  | 'reunion_programada'
  | 'cotizacion_enviada'
  | 'negociacion'
  | 'pendiente_respuesta'
  | 'venta_cerrada'
  | 'proyecto_iniciado'
  | 'no_interesado'
  | 'cancelado'

export type FollowUpActionType =
  | 'llamada'
  | 'mensaje'
  | 'reunion'
  | 'cotizacion'
  | 'cliente_respondio'
  | 'cliente_interesado'
  | 'cliente_rechazo'
  | 'cliente_pospuso'
  | 'seguimiento'

export interface Prospect {
  id: string
  affiliateId: string
  affiliateName?: string
  companyName: string
  contactName: string
  contactRole?: string
  phone: string
  whatsapp: string
  email: string
  address?: string
  serviceInterest: string
  estimatedBudget?: number
  interestLevel: InterestLevel
  notes?: string
  firstContactDate: Timestamp | Date | string
  nextFollowUp?: Timestamp | Date | string
  status: ProspectStatus
  convertedClientId?: string
  convertedProjectId?: string
  createdAt: Timestamp | Date
}

export interface ProspectHistoryEntry {
  id: string
  prospectId: string
  actionType: FollowUpActionType | 'status_change'
  comment: string
  userId: string
  userName: string
  previousStatus?: ProspectStatus
  newStatus?: ProspectStatus
  createdAt: Timestamp | Date
}

export type CommissionStatus = 'pendiente' | 'aprobada' | 'pagada'

export interface Commission {
  id: string
  affiliateId: string
  clientId: string
  projectId: string
  prospectId?: string
  projectValue: number
  commissionPercent: number
  commissionAmount: number
  status: CommissionStatus
  approvedAt?: Timestamp | Date
  paidAt?: Timestamp | Date
  paymentMethod?: string
  notes?: string
  createdAt: Timestamp | Date
}

export type ReminderType = 'llamar' | 'propuesta' | 'reunion' | 'pago' | 'otro'

export interface Reminder {
  id: string
  userId: string
  prospectId?: string
  title: string
  description?: string
  type: ReminderType
  dueAt: Timestamp | Date | string
  completed: boolean
  createdAt: Timestamp | Date
}

export type NotificationType =
  | 'prospect_new'
  | 'client_new'
  | 'project_created'
  | 'status_change'
  | 'file_uploaded'
  | 'ticket_created'
  | 'ticket_replied'
  | 'commission_generated'
  | 'commission_paid'
  | 'reminder'
  | 'demo_paid'

export interface AppNotification {
  id: string
  userId: string
  role?: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  link?: string
  meta?: Record<string, string>
  createdAt: Timestamp | Date
}

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  role: string
  action: string
  clientId?: string
  projectId?: string
  affiliateId?: string
  prospectId?: string
  details?: string
  createdAt: Timestamp | Date
}

export interface ProjectTimelineEntry {
  id: string
  projectId: string
  stage: string
  label: string
  status: 'completed' | 'in_progress' | 'pending'
  responsible?: string
  comment?: string
  createdAt: Timestamp | Date
}

export type ClientTicketStatus = 'abierto' | 'en_revision' | 'respondido' | 'cerrado'

export interface ClientTicket {
  id: string
  clientId: string
  projectId?: string
  title: string
  description: string
  status: ClientTicketStatus
  attachments?: { url: string; name: string }[]
  createdAt: Timestamp | Date
  updatedAt?: Timestamp | Date
}

export interface DemoWizardData {
  step: number
  businessInfo: {
    name: string
    contactName: string
    email: string
    phone: string
    businessType: string
    description: string
  }
  logo?: { url: string; noLogo: boolean }
  colorPalette: { preset?: string; custom?: string }
  style: string
  typography: string
  sections: string[]
  features: string[]
  inspiration: { links: string[]; notes: string }
  paymentStatus?: 'pending' | 'paid'
}

export interface DemoWizardSession {
  id: string
  userId?: string
  email: string
  data: DemoWizardData
  amount: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: 'draft' | 'submitted' | 'paid'
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}
