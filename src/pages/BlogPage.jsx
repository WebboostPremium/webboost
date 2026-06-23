import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import Layout from '../layouts/Layout'
import { listPublishedPosts } from '../lib/blog'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPublishedPosts().then(setPosts).finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-xl text-3xl md:text-5xl text-ink mb-4"
          >
            Blog y novedades
          </motion.h1>
          <p className="text-slate-500 text-lg">Noticias, tips y actualizaciones de WebBooost.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !posts.length ? (
          <p className="text-center text-slate-500">Próximamente publicaremos contenido aquí.</p>
        ) : (
          <div className="max-w-4xl mx-auto grid gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-slate-100 overflow-hidden hover:border-electric/30 transition-colors"
              >
                {post.coverImage && (
                  <img src={post.coverImage} alt="" className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  {post.createdAt && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt?.seconds ? post.createdAt.seconds * 1000 : post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  <h2 className="text-xl font-bold text-ink mb-2">{post.title}</h2>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-electric font-semibold text-sm hover:gap-2 transition-all">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
