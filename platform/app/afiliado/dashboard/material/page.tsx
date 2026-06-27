'use client'

import Link from 'next/link'
import { Download, ExternalLink, FileText, Image, Video, Link2 } from 'lucide-react'
import { SALES_MATERIALS, MATERIAL_CATEGORIES, type SalesMaterial } from '@/config/sales-materials'

const TYPE_ICONS = {
  pdf: FileText,
  doc: FileText,
  image: Image,
  video: Video,
  link: Link2,
}

function MaterialCard({ item }: { item: SalesMaterial }) {
  const Icon = TYPE_ICONS[item.type]
  const isExternal = item.url.startsWith('http')
  const href = isExternal ? item.url : item.url

  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-5 flex flex-col">
      <Icon className="w-8 h-8 text-electric mb-3" />
      <h3 className="font-bold text-ink">{item.title}</h3>
      <p className="text-sm text-slate-500 mt-1 flex-1">{item.description}</p>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm text-electric font-semibold inline-flex items-center gap-1">
          <Download className="w-4 h-4" /> Descargar
        </a>
      ) : (
        <Link href={href} className="mt-4 text-sm text-electric font-semibold inline-flex items-center gap-1">
          <ExternalLink className="w-4 h-4" /> Abrir enlace
        </Link>
      )}
    </div>
  )
}

export default function MaterialPage() {
  const categories = Object.keys(MATERIAL_CATEGORIES) as Array<keyof typeof MATERIAL_CATEGORIES>

  return (
    <div>
      <h1 className="heading-xl text-2xl text-ink">Material de ventas</h1>
      <p className="text-slate-500 mt-1">Recursos para promover WebBoost y cerrar ventas.</p>

      {categories.map((cat) => {
        const items = SALES_MATERIALS.filter((m) => m.category === cat)
        if (!items.length) return null
        return (
          <section key={cat} className="mt-10">
            <h2 className="font-bold text-ink mb-4">{MATERIAL_CATEGORIES[cat]}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <MaterialCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
