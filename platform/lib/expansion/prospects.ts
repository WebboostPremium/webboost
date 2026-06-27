import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp, addDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { Prospect, ProspectHistoryEntry, ProspectStatus, FollowUpActionType } from '@/types/expansion'

export async function createProspect(affiliateId: string, data: Omit<Prospect, 'id' | 'affiliateId' | 'status' | 'createdAt'>) {
  if (!db) throw new Error('Firestore no disponible')
  const ref = doc(collection(db, COLLECTIONS.prospects))
  const payload = {
    ...data,
    affiliateId,
    status: 'nuevo' as ProspectStatus,
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, payload)
  return { id: ref.id, ...payload }
}

export async function listProspectsByAffiliate(affiliateId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.prospects),
    where('affiliateId', '==', affiliateId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Prospect[]
}

export async function listAllProspects() {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.prospects), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Prospect[]
}

export async function getProspect(id: string) {
  if (!db) return null
  const snap = await getDoc(doc(db, COLLECTIONS.prospects, id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Prospect) : null
}

export async function updateProspect(id: string, data: Partial<Prospect>) {
  if (!db) throw new Error('Firestore no disponible')
  await updateDoc(doc(db, COLLECTIONS.prospects, id), { ...data, updatedAt: serverTimestamp() })
}

export async function addProspectHistory(
  prospectId: string,
  entry: Omit<ProspectHistoryEntry, 'id' | 'prospectId' | 'createdAt'>,
) {
  if (!db) throw new Error('Firestore no disponible')
  const ref = await addDoc(collection(db, COLLECTIONS.prospectHistory), {
    ...entry,
    prospectId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getProspectHistory(prospectId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.prospectHistory),
    where('prospectId', '==', prospectId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ProspectHistoryEntry[]
}

export async function changeProspectStatus(
  prospectId: string,
  newStatus: ProspectStatus,
  userId: string,
  userName: string,
  comment?: string,
) {
  const prospect = await getProspect(prospectId)
  if (!prospect) throw new Error('Prospecto no encontrado')
  await updateProspect(prospectId, { status: newStatus })
  await addProspectHistory(prospectId, {
    actionType: 'status_change',
    comment: comment || `Estado cambiado a ${newStatus}`,
    userId,
    userName,
    previousStatus: prospect.status,
    newStatus,
  })
  return { previousStatus: prospect.status, newStatus }
}

export async function logFollowUp(
  prospectId: string,
  actionType: FollowUpActionType,
  userId: string,
  userName: string,
  comment: string,
) {
  return addProspectHistory(prospectId, { actionType, comment, userId, userName })
}

export async function reassignProspect(prospectId: string, newAffiliateId: string, adminId: string, adminName: string) {
  await updateProspect(prospectId, { affiliateId: newAffiliateId })
  await addProspectHistory(prospectId, {
    actionType: 'seguimiento',
    comment: `Prospecto reasignado por administrador`,
    userId: adminId,
    userName: adminName,
  })
}

export function computeAffiliateStats(prospects: Prospect[]) {
  const total = prospects.length
  const closed = prospects.filter((p) => p.status === 'venta_cerrada' || p.status === 'proyecto_iniciado').length
  const conversion = total ? Math.round((closed / total) * 100) : 0
  return { total, closed, conversion }
}

export async function listAffiliateFollowUps(affiliateId: string) {
  const prospects = await listProspectsByAffiliate(affiliateId)
  const entries = await Promise.all(
    prospects.map(async (p) => {
      const history = await getProspectHistory(p.id)
      return history.map((h) => ({ ...h, prospectId: p.id, prospectName: p.companyName }))
    }),
  )
  return entries
    .flat()
    .sort((a, b) => {
      const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0
      const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0
      return tb - ta
    })
}
