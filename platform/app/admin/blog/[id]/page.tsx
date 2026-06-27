'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { savePost, getPostById } from '@/lib/blog'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const isNew = id === 'nuevo'

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    coverImage: '',
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    getPostById(id).then((post) => {
      if (post) {
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          published: !!post.published,
          coverImage: post.coverImage || '',
        })
      }
      setLoading(false)
    })
  }, [id, isNew])

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isNew || !prev.slug ? slugify(title) : prev.slug,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await savePost({
        id: isNew ? undefined : id,
        ...form,
        authorId: user?.uid,
        authorName: profile?.name || user?.email || '',
      })
      toast('Artículo guardado', 'success')
      router.push('/admin/blog')
    } catch {
      toast('Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink mb-8">
        {isNew ? 'Nuevo artículo' : 'Editar artículo'}
      </h1>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-100 p-6 space-y-4 max-w-3xl">
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Título</label>
          <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Slug (URL)</label>
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm font-mono" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Extracto</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm min-h-[80px]" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Contenido</label>
          <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm min-h-[240px]" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Imagen de portada (URL)</label>
          <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className="w-full rounded-xl border px-4 py-2.5 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Publicar inmediatamente
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-cta disabled:opacity-60">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => router.push('/admin/blog')} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
