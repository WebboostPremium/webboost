import { collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { AppNotification, NotificationType } from '@/types/expansion'

export async function sendNotification(params: {
  userId: string
  role?: string
  type: NotificationType
  title: string
  body: string
  link?: string
  meta?: Record<string, string>
}) {
  if (!db) return null
  const ref = doc(collection(db, COLLECTIONS.notifications))
  const payload = { ...params, read: false, createdAt: serverTimestamp() }
  await setDoc(ref, payload)
  return ref.id
}

export async function getUserNotifications(userId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AppNotification[]
}

export async function markNotificationRead(id: string) {
  if (!db) return
  await updateDoc(doc(db, COLLECTIONS.notifications, id), { read: true })
}

export async function markAllNotificationsRead(userId: string) {
  if (!db) return
  const items = await getUserNotifications(userId)
  const batch = writeBatch(db)
  items.filter((n) => !n.read).forEach((n) => {
    batch.update(doc(db!, COLLECTIONS.notifications, n.id), { read: true })
  })
  await batch.commit()
}

export async function notifyAdmins(type: NotificationType, title: string, body: string, link?: string) {
  // In production, fetch admin user IDs from Firestore. For now, notifications with role admin are queried client-side.
  return sendNotification({ userId: '__admins__', role: 'admin', type, title, body, link })
}
