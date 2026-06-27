import { collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { ClientTicket, ClientTicketStatus } from '@/types/expansion'

export async function createTicket(data: Omit<ClientTicket, 'id' | 'createdAt' | 'status'>) {
  if (!db) throw new Error('Firestore no disponible')
  const ref = doc(collection(db, COLLECTIONS.clientTickets))
  await setDoc(ref, { ...data, status: 'abierto', createdAt: serverTimestamp() })
  return ref.id
}

export async function listClientTickets(clientId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.clientTickets),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ClientTicket[]
}

export async function listAllTickets() {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.clientTickets), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ClientTicket[]
}

export async function updateTicketStatus(id: string, status: ClientTicketStatus) {
  if (!db) return
  await updateDoc(doc(db, COLLECTIONS.clientTickets, id), { status, updatedAt: serverTimestamp() })
}

export async function listClientAssets(clientId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.assets),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
