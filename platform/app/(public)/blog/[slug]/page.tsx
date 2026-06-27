'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar, ArrowLeft } from 'lucide-react'
import { getPostBySlug, formatPostDate, type BlogPost } from '@/lib/blog'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getPostBySlug(slug).then(setPost).finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-28 flex justify-center">
        <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-28 px-4 text-center">
        <p className="text-slate-500">Artículo no encontrado.</p>
        <Link href="/blog" className="text-electric font-semibold mt-4 inline-block">← Volver al blog</Link>
      </div>
    )
  }

  return (
    <article className="pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-electric font-semibold mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>
        {post.createdAt && (
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            {formatPostDate(post.createdAt)}
          </p>
        )}
        <h1 className="heading-xl text-3xl md:text-4xl text-ink mb-4">{post.title}</h1>
        {post.coverImage && (
          <img src={post.coverImage} alt="" className="w-full rounded-2xl mb-8 object-cover max-h-96" />
        )}
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
          {post.content}
        </div>
      </div>
    </article>
  )
}
