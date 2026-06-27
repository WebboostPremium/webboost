import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { AuditLogEntry } from '@/types/expansion'

export async function logAudit(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>) {
  if (!db) return null
  const ref = await addDoc(collection(db, COLLECTIONS.auditLogs), {
    ...entry,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function listAuditLogs(max = 100) {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.auditLogs), orderBy('createdAt', 'desc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AuditLogEntry[]
}
