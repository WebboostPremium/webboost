'use client'

import { Suspense } from 'react'
import ProspectosPageInner from './ProspectosPageInner'

export default function ProspectosPage() {
  return (
    <Suspense fallback={null}>
      <ProspectosPageInner />
    </Suspense>
  )
}
