import {
  collection, doc, getDoc, getDocs, query, orderBy, limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { DemoWizardSession } from '@/types/expansion'

export async function listDemoSessions() {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.demoWizardSessions), orderBy('createdAt', 'desc'), limit(100))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DemoWizardSession[]
}

export async function getDemoSession(id: string) {
  if (!db) return null
  const snap = await getDoc(doc(db, COLLECTIONS.demoWizardSessions, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as DemoWizardSession) : null
}

export function demoSessionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: 'Borrador',
    submitted: 'Enviada',
    paid: 'Pagada',
    reviewed: 'Revisada',
    contacted: 'Contactado',
    closed: 'Cerrada',
  }
  return labels[status] || status
}
