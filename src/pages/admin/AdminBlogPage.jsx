import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { listAllPosts, deletePost } from '../../lib/blog'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    listAllPosts().then(setPosts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este artículo?')) return
    await deletePost(id)
    load()
  }

  return (
    <DashboardLayout variant="admin">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="heading-xl text-2xl md:text-3xl text-ink">Blog y novedades</h1>
        <Link to="/admin/blog/nuevo" className="btn-cta inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>

      {loading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !posts.length ? (
        <p className="text-slate-500">No hay artículos. Crea el primero.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-2xl bg-white border border-slate-100 p-5 flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-bold text-ink">{post.title}</p>
                <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</p>
                <span className={`text-xs font-semibold mt-2 inline-block px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {post.published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/blog/${post.id}`} className="p-2 text-electric hover:bg-electric/10 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button type="button" onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  )
}
