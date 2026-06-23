import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'

export const SITE_STATUS = {
  PENDING: 'pending',
  BUILDING: 'building',
  ACTIVE: 'active',
  PAUSED: 'paused',
}

export async function getUserSites(userId) {
  if (!db || !userId) return []
  const q = query(
    collection(db, 'sites'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function listAllSites() {
  if (!db) return []
  const q = query(collection(db, 'sites'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createSite(data) {
  if (!db) throw new Error('Firestore no configurado')
  const ref = doc(collection(db, 'sites'))
  const payload = {
    userId: data.userId,
    userEmail: data.userEmail || '',
    name: data.name,
    url: data.url || '',
    plan: data.plan || 'Starter',
    status: data.status || SITE_STATUS.PENDING,
    notes: data.notes || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(ref, payload)
  return { id: ref.id, ...payload }
}

export async function updateSite(siteId, data) {
  if (!db) throw new Error('Firestore no configurado')
  await updateDoc(doc(db, 'sites', siteId), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteSite(siteId) {
  if (!db) throw new Error('Firestore no configurado')
  await deleteDoc(doc(db, 'sites', siteId))
}
