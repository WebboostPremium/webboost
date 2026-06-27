import {
  collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { Commission, CommissionStatus } from '@/types/expansion'

export async function createCommission(data: Omit<Commission, 'id' | 'createdAt' | 'status'>) {
  if (!db) throw new Error('Firestore no disponible')
  const ref = doc(collection(db, COLLECTIONS.commissions))
  const payload = {
    ...data,
    status: 'pendiente' as CommissionStatus,
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, payload)
  return { id: ref.id, ...payload }
}

export async function listCommissionsByAffiliate(affiliateId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.commissions),
    where('affiliateId', '==', affiliateId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Commission[]
}

export async function listAllCommissions() {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.commissions), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Commission[]
}

export async function updateCommissionStatus(
  id: string,
  status: CommissionStatus,
  extra?: { paymentMethod?: string; notes?: string },
) {
  if (!db) throw new Error('Firestore no disponible')
  const updates: Record<string, unknown> = { status, ...extra }
  if (status === 'aprobada') updates.approvedAt = serverTimestamp()
  if (status === 'pagada') updates.paidAt = serverTimestamp()
  await updateDoc(doc(db, COLLECTIONS.commissions, id), updates)
}

export function computeCommissionTotals(commissions: Commission[]) {
  const pending = commissions.filter((c) => c.status === 'pendiente' || c.status === 'aprobada')
  const paid = commissions.filter((c) => c.status === 'pagada')
  return {
    pendingAmount: pending.reduce((s, c) => s + c.commissionAmount, 0),
    paidAmount: paid.reduce((s, c) => s + c.commissionAmount, 0),
    totalGenerated: commissions.reduce((s, c) => s + c.commissionAmount, 0),
    totalBilled: commissions.reduce((s, c) => s + c.projectValue, 0),
    avgTicket: commissions.length ? commissions.reduce((s, c) => s + c.projectValue, 0) / commissions.length : 0,
  }
}
