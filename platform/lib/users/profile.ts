import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { UserProfile, UserRole } from '@/types'
import type { User } from 'firebase/auth'

function resolveRole(email: string): UserRole {
  const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (admins.includes(email.toLowerCase())) return 'admin'
  return 'client'
}

export async function ensureUserProfile(authUser: User): Promise<UserProfile | null> {
  if (!db || !authUser) return null

  const ref = doc(db, COLLECTIONS.users, authUser.uid)
  const snap = await getDoc(ref)
  const role = resolveRole(authUser.email || '')

  if (!snap.exists()) {
    const profile = {
      uid: authUser.uid,
      name: authUser.displayName || '',
      email: authUser.email || '',
      role,
      status: 'active' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    await setDoc(ref, profile)
    return {
      uid: authUser.uid,
      name: authUser.displayName || '',
      email: authUser.email || '',
      role,
      status: 'active',
      createdAt: new Date(),
    } as UserProfile
  }

  const data = snap.data() as UserProfile
  if (role === 'admin' && data.role !== 'admin') {
    await setDoc(ref, { role: 'admin', updatedAt: serverTimestamp() }, { merge: true })
    return { ...data, role: 'admin' }
  }

  return data
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}
