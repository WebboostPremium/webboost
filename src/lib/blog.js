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
import { db } from './firebase'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function listAllPosts() {
  if (!db) return []
  const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getPostBySlug(slug, { includeDrafts = false } = {}) {
  if (!db || !slug) return null
  const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  const post = { id: d.id, ...d.data() }
  if (!includeDrafts && !post.published) return null
  return post
}

export async function getPostById(id) {
  if (!db || !id) return null
  const snap = await getDoc(doc(db, 'blogPosts', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function savePost({ id, title, slug, excerpt, content, published, coverImage, authorId, authorName }) {
  if (!db) throw new Error('Firestore no configurado')
  const finalSlug = slug || slugify(title)
  const payload = {
    title,
    slug: finalSlug,
    excerpt: excerpt || '',
    content: content || '',
    published: Boolean(published),
    coverImage: coverImage || '',
    authorId: authorId || '',
    authorName: authorName || '',
    updatedAt: serverTimestamp(),
  }

  if (id) {
    await updateDoc(doc(db, 'blogPosts', id), payload)
    return { id, ...payload }
  }

  const ref = doc(collection(db, 'blogPosts'))
  await setDoc(ref, { ...payload, createdAt: serverTimestamp() })
  return { id: ref.id, ...payload }
}

export async function deletePost(id) {
  if (!db) throw new Error('Firestore no configurado')
  await deleteDoc(doc(db, 'blogPosts', id))
}
