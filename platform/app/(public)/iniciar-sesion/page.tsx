import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata: Metadata = { title: 'Iniciar sesión' }

export default function LoginPage() {
  return (
    <section className="pt-32 pb-20 px-5">
      <div className="max-w-md mx-auto text-center mb-8">
        <h1 className="heading-xl text-3xl md:text-4xl text-ink">Inicia sesión</h1>
        <p className="mt-3 text-slate-500 text-sm">Accede a tu panel de WebBooost.</p>
      </div>
      <div className="max-w-md mx-auto">
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </section>
  )
}
