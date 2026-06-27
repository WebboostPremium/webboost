import {
  collection, doc, getDoc, getDocs, query, where, limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { Payment } from '@/types'

export async function listClientPayments(clientId: string, email?: string) {
  if (!db) return []
  const results: Payment[] = []

  if (clientId) {
    const byId = query(collection(db, COLLECTIONS.payments), where('clientId', '==', clientId), limit(50))
    const snap = await getDocs(byId)
    results.push(...snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Payment[])
  }

  if (email) {
    const byEmail = query(collection(db, COLLECTIONS.payments), where('clientEmail', '==', email), limit(50))
    const emailSnap = await getDocs(byEmail)
    const emailPayments = emailSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Payment[]
    for (const p of emailPayments) {
      if (!results.some((r) => r.id === p.id)) results.push(p)
    }
  }

  return results.sort((a, b) => {
    const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0
    const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0
    return tb - ta
  })
}

export async function listAllPayments() {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.payments), limit(100))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Payment)
    .sort((a, b) => {
      const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0
      const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0
      return tb - ta
    })
}

export async function getPayment(id: string) {
  if (!db) return null
  const snap = await getDoc(doc(db, COLLECTIONS.payments, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Payment) : null
}

export function paymentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    expired: 'Expirado',
    refunded: 'Reembolsado',
  }
  return labels[status] || status
}

export function paymentTypeLabel(type: string) {
  const labels: Record<string, string> = {
    demo: 'Demo personalizada',
    setup: 'Setup',
    monthly: 'Mensualidad',
    app_activation: 'Activación app',
    extra: 'Extra',
  }
  return labels[type] || type
}
