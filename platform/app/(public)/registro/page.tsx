import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata: Metadata = { title: 'Registro' }

export default function RegisterPage() {
  return (
    <section className="pt-32 pb-20 px-5">
      <div className="max-w-md mx-auto text-center mb-8">
        <h1 className="heading-xl text-3xl md:text-4xl text-ink">Crea tu cuenta</h1>
        <p className="mt-3 text-slate-500 text-sm">Regístrate para gestionar tu proyecto y apps.</p>
      </div>
      <div className="max-w-md mx-auto">
        <Suspense fallback={null}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </section>
  )
}
