import {
  collection, doc, getDoc, getDocs, query, where, orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import { SITE } from '@/config/site'
import type { Affiliate } from '@/types'
import { listProspectsByAffiliate, computeAffiliateStats } from '@/lib/expansion/prospects'
import { listCommissionsByAffiliate, computeCommissionTotals } from '@/lib/expansion/commissions'

export function buildReferralLink(code: string): string {
  const base = SITE.url.replace(/\/$/, '')
  return `${base}/registro?ref=${encodeURIComponent(code)}`
}

export async function getAffiliateByUserId(userId: string): Promise<Affiliate | null> {
  if (!db) return null
  const direct = await getDoc(doc(db, COLLECTIONS.affiliates, userId))
  if (direct.exists()) return { id: direct.id, ...direct.data() } as Affiliate

  const q = query(collection(db, COLLECTIONS.affiliates), where('userId', '==', userId))
  const snap = await getDocs(q)
  const first = snap.docs[0]
  return first ? ({ id: first.id, ...first.data() } as Affiliate) : null
}

export async function listAllAffiliates(): Promise<Affiliate[]> {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.affiliates), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Affiliate[]
}

export async function getAffiliateDashboardStats(userId: string) {
  const [prospects, commissions] = await Promise.all([
    listProspectsByAffiliate(userId),
    listCommissionsByAffiliate(userId),
  ])
  const prospectStats = computeAffiliateStats(prospects)
  const commissionStats = computeCommissionTotals(commissions)
  const clients = prospects.filter(
    (p) => p.status === 'venta_cerrada' || p.status === 'proyecto_iniciado',
  ).length

  return {
    prospects: prospectStats.total,
    conversion: prospectStats.conversion,
    closedSales: prospectStats.closed,
    clients,
    pendingCommission: commissionStats.pendingAmount,
    paidCommission: commissionStats.paidAmount,
    totalGenerated: commissionStats.totalGenerated,
    pipelineActive: prospectStats.total - prospectStats.closed,
  }
}
