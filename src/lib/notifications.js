import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

export async function getUserNotifications(userId) {
  if (!db || !userId) return []
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function markNotificationRead(id) {
  if (!db) throw new Error('Firestore no configurado')
  await updateDoc(doc(db, 'notifications', id), { read: true })
}

export async function markAllRead(userId) {
  if (!db) throw new Error('Firestore no configurado')
  const items = await getUserNotifications(userId)
  const batch = writeBatch(db)
  items.filter((n) => !n.read).forEach((n) => {
    batch.update(doc(db, 'notifications', n.id), { read: true })
  })
  await batch.commit()
}

export async function sendNotificationToUser(userId, { title, body, type = 'info' }) {
  if (!db) throw new Error('Firestore no configurado')
  const ref = doc(collection(db, 'notifications'))
  const payload = {
    userId,
    title,
    body,
    type,
    read: false,
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, payload)
  return { id: ref.id, ...payload }
}

export async function sendNotificationToAll(users, { title, body, type = 'info' }) {
  if (!db) throw new Error('Firestore no configurado')
  const batch = writeBatch(db)
  users.forEach((u) => {
    const ref = doc(collection(db, 'notifications'))
    batch.set(ref, {
      userId: u.id || u.uid,
      title,
      body,
      type,
      read: false,
      createdAt: serverTimestamp(),
    })
  })
  await batch.commit()
}

export async function listAllNotifications() {
  if (!db) return []
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
