import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  published?: boolean
  coverImage?: string
  authorId?: string
  authorName?: string
  createdAt?: { seconds: number } | Date
  updatedAt?: unknown
}

export async function listPublishedPosts(max = 50) {
  if (!db) return []
  const q = query(
    collection(db, 'blogPosts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(max),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[]
}

export async function listAllPosts() {
  if (!db) return []
  const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[]
}

export async function getPostBySlug(slug: string, { includeDrafts = false } = {}) {
  if (!db || !slug) return null
  const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  const post = { id: d.id, ...d.data() } as BlogPost
  if (!includeDrafts && !post.published) return null
  return post
}

export async function getPostById(id: string) {
  if (!db || !id) return null
  const snap = await getDoc(doc(db, 'blogPosts', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as BlogPost) : null
}

export async function savePost(data: {
  id?: string
  title: string
  slug?: string
  excerpt?: string
  content?: string
  published?: boolean
  coverImage?: string
  authorId?: string
  authorName?: string
}) {
  if (!db) throw new Error('Firestore no configurado')
  const finalSlug = data.slug || slugify(data.title)
  const payload = {
    title: data.title,
    slug: finalSlug,
    excerpt: data.excerpt || '',
    content: data.content || '',
    published: Boolean(data.published),
    coverImage: data.coverImage || '',
    authorId: data.authorId || '',
    authorName: data.authorName || '',
    updatedAt: serverTimestamp(),
  }

  if (data.id) {
    await updateDoc(doc(db, 'blogPosts', data.id), payload)
    return { id: data.id, ...payload }
  }

  const ref = doc(collection(db, 'blogPosts'))
  await setDoc(ref, { ...payload, createdAt: serverTimestamp() })
  return { id: ref.id, ...payload }
}

export async function deletePost(id: string) {
  if (!db) throw new Error('Firestore no configurado')
  await deleteDoc(doc(db, 'blogPosts', id))
}

export function formatPostDate(createdAt?: BlogPost['createdAt']) {
  if (!createdAt) return ''
  const date = createdAt instanceof Date
    ? createdAt
    : new Date(createdAt.seconds * 1000)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
