'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { listAllPosts } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    listAllPosts().then(setPosts)
  }, [])

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Blog</h1>
      <p className="text-slate-500 mt-1">Gestiona artículos y novedades.</p>
      <Link href="/blog" className="text-sm text-electric font-semibold mt-4 inline-block">Ver blog público →</Link>
      <ul className="mt-8 space-y-2">
        {!posts.length ? (
          <li className="text-slate-500">No hay artículos publicados aún.</li>
        ) : posts.map((post) => (
          <li key={post.id} className="rounded-xl bg-white border border-slate-100 px-4 py-4 flex justify-between">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-sm text-slate-500">/{post.slug}</p>
            </div>
            <span className={`text-xs font-medium ${post.published ? 'text-green-600' : 'text-slate-400'}`}>
              {post.published ? 'Publicado' : 'Borrador'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
