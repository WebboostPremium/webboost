import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import Layout from '../layouts/Layout'
import { getPostBySlug } from '../lib/blog'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPostBySlug(slug).then(setPost).finally(() => setLoading(false))
  }, [slug])

  return (
    <Layout>
      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-electric font-semibold mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver al blog
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !post ? (
            <p className="text-slate-500">Artículo no encontrado.</p>
          ) : (
            <>
              {post.coverImage && (
                <img src={post.coverImage} alt="" className="w-full rounded-2xl mb-8 max-h-80 object-cover" />
              )}
              {post.createdAt && (
                <p className="text-sm text-slate-400 flex items-center gap-1 mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt?.seconds ? post.createdAt.seconds * 1000 : post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              <h1 className="heading-xl text-3xl md:text-4xl text-ink mb-6">{post.title}</h1>
              {post.excerpt && <p className="text-lg text-slate-500 mb-8">{post.excerpt}</p>}
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
                {post.content}
              </div>
            </>
          )}
        </div>
      </article>
    </Layout>
  )
}
