import { collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { Reminder } from '@/types/expansion'

export async function createReminder(data: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) {
  if (!db) throw new Error('Firestore no disponible')
  const ref = doc(collection(db, COLLECTIONS.reminders))
  await setDoc(ref, { ...data, completed: false, createdAt: serverTimestamp() })
  return ref.id
}

export async function listUserReminders(userId: string, includeCompleted = false) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.reminders),
    where('userId', '==', userId),
    orderBy('dueAt', 'asc'),
  )
  const snap = await getDocs(q)
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Reminder[]
  return includeCompleted ? items : items.filter((r) => !r.completed)
}

export async function completeReminder(id: string) {
  if (!db) return
  await updateDoc(doc(db, COLLECTIONS.reminders, id), { completed: true })
}
