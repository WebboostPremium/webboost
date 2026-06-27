import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'client' | 'admin' | 'affiliate'

export type UserStatus = 'active' | 'inactive' | 'pending'

export interface UserProfile {
  uid: string
  name: string
  email: string
  phone?: string
  role: UserRole
  businessName?: string
  plan?: string
  status: UserStatus
  createdAt: Timestamp | Date
  updatedAt?: Timestamp | Date
}

export type DemoPaymentStatus = 'pending' | 'paid' | 'failed' | 'expired'
export type DemoRequestStatus = 'pending_payment' | 'paid' | 'reviewed' | 'contacted' | 'closed'

export interface DemoRequest {
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  businessType: string
  need: string
  selectedPlan: string
  message?: string
  amount: number
  paymentStatus: DemoPaymentStatus
  wompiLink?: string
  wompiTransactionId?: string
  status: DemoRequestStatus
  userId?: string
  createdAt: Timestamp | Date
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export interface Lead {
  id: string
  demoId?: string
  name: string
  email: string
  phone: string
  businessName: string
  need: string
  source: string
  status: LeadStatus
  assignedTo?: string
  createdAt: Timestamp | Date
}

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'pending_client_review'
  | 'accepted'
  | 'changes_requested'
  | 'rejected'
  | 'paid'

export interface Proposal {
  id: string
  clientId: string
  leadId?: string
  title: string
  description: string
  plan: string
  setupFee: number
  monthlyPrice: number
  deliveryTime: string
  includes: string[]
  notes?: string
  status: ProposalStatus
  demoCredit?: number
  createdAt: Timestamp | Date
  sentAt?: Timestamp | Date
  acceptedAt?: Timestamp | Date
}

export type ProjectStatus =
  | 'demo_paid'
  | 'proposal_accepted'
  | 'design'
  | 'development'
  | 'review'
  | 'published'
  | 'paused'

export interface Project {
  id: string
  clientId: string
  proposalId?: string
  title: string
  type: string
  status: ProjectStatus
  progress: number
  deliveryDate?: Timestamp | Date
  createdAt: Timestamp | Date
}

export type PaymentType = 'demo' | 'setup' | 'monthly' | 'app_activation' | 'extra'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'

export interface Payment {
  id: string
  clientId?: string
  clientEmail?: string
  demoId?: string
  demoSessionId?: string
  proposalId?: string
  businessId?: string
  amount: number
  currency: string
  type: PaymentType
  status: PaymentStatus
  description?: string
  wompiLink?: string
  wompiTransactionId?: string
  createdAt: Timestamp | Date
  paidAt?: Timestamp | Date
}

export type AppType = 'catalog' | 'bookings' | 'business_page' | 'crm' | 'dashboard' | 'menu' | 'whatsapp_orders'
export type BusinessStatus = 'draft' | 'active' | 'paused' | 'suspended'

export interface Business {
  id: string
  ownerId: string
  name: string
  slug: string
  subdomain: string
  domain: string
  appType: AppType
  plan: string
  status: BusinessStatus
  branding?: {
    logoUrl?: string
    heroImageUrl?: string
    primaryColor?: string
    whatsapp?: string
  }
  createdAt: Timestamp | Date
}

export interface Product {
  id: string
  businessId: string
  name: string
  description: string
  price: number
  imageUrl?: string
  cloudinaryPublicId?: string
  category: string
  active: boolean
  featured?: boolean
  createdAt: Timestamp | Date
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Order {
  id: string
  businessId: string
  customerName: string
  customerPhone: string
  items: { productId: string; name: string; qty: number; price: number }[]
  status: OrderStatus
  notes?: string
  createdAt: Timestamp | Date
}

export type AssetType = 'logo' | 'photo' | 'catalog' | 'document' | 'other'

export interface Asset {
  id: string
  clientId: string
  projectId?: string
  businessId?: string
  type: AssetType
  cloudinaryPublicId: string
  url: string
  name: string
  createdAt: Timestamp | Date
}

export type TicketType = 'text_change' | 'new_section' | 'support' | 'integration' | 'other'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface Ticket {
  id: string
  clientId: string
  projectId?: string
  businessId?: string
  type: TicketType
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: Timestamp | Date
}

export interface Affiliate {
  id: string
  userId: string
  code: string
  totalReferrals: number
  pendingCommission: number
  paidCommission: number
  createdAt: Timestamp | Date
}

export type ReferralStatus = 'pending' | 'converted' | 'paid'

export interface Referral {
  id: string
  affiliateId: string
  clientId: string
  status: ReferralStatus
  commissionAmount: number
  createdAt: Timestamp | Date
}

export interface SessionUser {
  uid: string
  email: string
  name: string
  role: UserRole
}
