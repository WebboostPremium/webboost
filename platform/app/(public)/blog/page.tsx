'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { listPublishedPosts, formatPostDate, type BlogPost } from '@/lib/blog'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPublishedPosts().then(setPosts).finally(() => setLoading(false))
  }, [])

  return (
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="heading-xl text-3xl md:text-5xl text-ink mb-4">Blog</h1>
        <p className="text-slate-500 text-lg">Noticias, tips y actualizaciones de WebBoost.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !posts.length ? (
        <p className="text-center text-slate-500">Próximamente publicaremos contenido aquí.</p>
      ) : (
        <div className="max-w-4xl mx-auto grid gap-6">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl bg-white border border-slate-100 overflow-hidden hover:border-electric/30 transition-colors">
              {post.coverImage && (
                <img src={post.coverImage} alt="" className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                {post.createdAt && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatPostDate(post.createdAt)}
                  </p>
                )}
                <h2 className="text-xl font-bold text-ink mb-2">{post.title}</h2>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-electric font-semibold text-sm hover:gap-2 transition-all">
                  Leer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
