import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db, getAdminEmails } from './firebase'

export const ROLES = { USER: 'user', ADMIN: 'admin' }

export async function ensureUserProfile(authUser) {
  if (!db || !authUser) return null

  const ref = doc(db, 'users', authUser.uid)
  const snap = await getDoc(ref)
  const isAdmin = getAdminEmails().includes((authUser.email || '').toLowerCase())

  if (!snap.exists()) {
    const profile = {
      uid: authUser.uid,
      email: authUser.email || '',
      displayName: authUser.displayName || '',
      role: isAdmin ? ROLES.ADMIN : ROLES.USER,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    await setDoc(ref, profile)
    return { ...profile, id: authUser.uid }
  }

  const data = snap.data()
  if (isAdmin && data.role !== ROLES.ADMIN) {
    await updateDoc(ref, { role: ROLES.ADMIN, updatedAt: serverTimestamp() })
    return { ...data, id: authUser.uid, role: ROLES.ADMIN }
  }

  return { id: authUser.uid, ...data }
}

export async function getUserProfile(uid) {
  if (!db || !uid) return null
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function listAllUsers() {
  if (!db) return []
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateUserRole(uid, role) {
  if (!db) throw new Error('Firestore no configurado')
  await updateDoc(doc(db, 'users', uid), { role, updatedAt: serverTimestamp() })
}
