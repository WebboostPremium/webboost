'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'
import { listAllPosts, deletePost, type BlogPost } from '@/lib/blog'

export default function AdminBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])

  function load() {
    listAllPosts().then(setPosts)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este artículo?')) return
    try {
      await deletePost(id)
      toast('Artículo eliminado', 'success')
      load()
    } catch {
      toast('Error al eliminar', 'error')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-xl text-2xl text-ink">Blog</h1>
          <p className="text-slate-500 mt-1">Gestiona artículos y novedades.</p>
        </div>
        <Link href="/admin/blog/nuevo" className="btn-cta text-sm inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>

      <Link href="/blog" className="text-sm text-electric font-semibold mt-4 inline-block">Ver blog público →</Link>

      <ul className="mt-8 space-y-2">
        {!posts.length ? (
          <li className="text-slate-500">No hay artículos aún.</li>
        ) : posts.map((post) => (
          <li key={post.id} className="rounded-xl bg-white border border-slate-100 px-4 py-4 flex justify-between items-center gap-4">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-sm text-slate-500">/{post.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${post.published ? 'text-green-600' : 'text-slate-400'}`}>
                {post.published ? 'Publicado' : 'Borrador'}
              </span>
              <button type="button" onClick={() => router.push(`/admin/blog/${post.id}`)} className="p-2 text-slate-400 hover:text-electric">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
