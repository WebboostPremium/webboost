import type { Firestore } from 'firebase-admin/firestore'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { Affiliate, AffiliateStatus } from '@/types'

export function generateAffiliateCode(name: string, email: string): string {
  const base = (name || email.split('@')[0] || 'WB')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 6)
    .toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${base || 'WB'}${suffix}`
}

export async function ensureAffiliateRecord(
  adminDb: Firestore,
  userId: string,
  name: string,
  email: string,
  code?: string,
): Promise<Affiliate> {
  const ref = adminDb.collection(COLLECTIONS.affiliates).doc(userId)
  const snap = await ref.get()

  if (snap.exists) {
    const data = snap.data()!
    if (!data.name || !data.email) {
      await ref.set({ name, email, updatedAt: new Date() }, { merge: true })
    }
    return { id: ref.id, ...snap.data(), name, email } as Affiliate
  }

  const affiliateCode = code || generateAffiliateCode(name, email)
  const payload = {
    userId,
    name,
    email,
    code: affiliateCode,
    status: 'active' as AffiliateStatus,
    totalReferrals: 0,
    pendingCommission: 0,
    paidCommission: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await ref.set(payload)
  return { id: ref.id, ...payload }
}

export async function promoteUserToAffiliate(
  adminDb: Firestore,
  userId: string,
  opts?: { code?: string; notes?: string },
) {
  const userRef = adminDb.collection(COLLECTIONS.users).doc(userId)
  const userSnap = await userRef.get()
  if (!userSnap.exists) throw new Error('Usuario no encontrado')

  const user = userSnap.data()!
  if (user.role === 'admin') throw new Error('No se puede convertir un admin en afiliado')

  await userRef.set(
    { role: 'affiliate', status: 'active', updatedAt: new Date() },
    { merge: true },
  )

  const affiliate = await ensureAffiliateRecord(
    adminDb,
    userId,
    user.name || '',
    user.email || '',
    opts?.code,
  )

  if (opts?.notes) {
    await adminDb.collection(COLLECTIONS.affiliates).doc(userId).set(
      { notes: opts.notes, updatedAt: new Date() },
      { merge: true },
    )
  }

  return affiliate
}

export async function updateAffiliateAdmin(
  adminDb: Firestore,
  affiliateId: string,
  data: { status?: AffiliateStatus; code?: string; notes?: string },
) {
  const ref = adminDb.collection(COLLECTIONS.affiliates).doc(affiliateId)
  const snap = await ref.get()
  if (!snap.exists) throw new Error('Afiliado no encontrado')

  const updates: Record<string, unknown> = { updatedAt: new Date(), ...data }
  await ref.update(updates)

  if (data.status === 'inactive') {
    await adminDb.collection(COLLECTIONS.users).doc(snap.data()!.userId).set(
      { status: 'inactive', updatedAt: new Date() },
      { merge: true },
    )
  } else if (data.status === 'active') {
    await adminDb.collection(COLLECTIONS.users).doc(snap.data()!.userId).set(
      { status: 'active', updatedAt: new Date() },
      { merge: true },
    )
  }
}
