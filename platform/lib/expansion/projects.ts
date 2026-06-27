import { collection, doc, getDocs, setDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import type { ProjectTimelineEntry } from '@/types/expansion'
import { PROJECT_STAGES } from '@/lib/constants/expansion'

export async function getProjectTimeline(projectId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.projectTimeline),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ProjectTimelineEntry[]
}

export async function initProjectTimeline(projectId: string) {
  if (!db) return
  const existing = await getProjectTimeline(projectId)
  if (existing.length) return existing

  for (let i = 0; i < PROJECT_STAGES.length; i++) {
    const ref = doc(collection(db, COLLECTIONS.projectTimeline))
    await setDoc(ref, {
      projectId,
      stage: `stage_${i}`,
      label: PROJECT_STAGES[i],
      status: i === 0 ? 'in_progress' : 'pending',
      createdAt: serverTimestamp(),
    })
  }
  return getProjectTimeline(projectId)
}

export async function updateTimelineStage(
  entryId: string,
  status: ProjectTimelineEntry['status'],
  responsible?: string,
  comment?: string,
) {
  if (!db) return
  await setDoc(doc(db, COLLECTIONS.projectTimeline, entryId), {
    status,
    responsible,
    comment,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function getClientProjects(clientId: string) {
  if (!db) return []
  const q = query(
    collection(db, COLLECTIONS.projects),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function listAllProjects() {
  if (!db) return []
  const q = query(collection(db, COLLECTIONS.projects), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
