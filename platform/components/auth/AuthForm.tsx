'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase/client'
import { getRoleRedirect } from '@/lib/auth/session'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRegister = mode === 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!isFirebaseConfigured || !auth) {
      setError('Firebase no está configurado. Revisa las variables de entorno.')
      return
    }

    setLoading(true)
    try {
      const from = searchParams.get('from')
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }

      const idToken = await auth.currentUser?.getIdToken()
      if (idToken) {
        const res = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
        const data = await res.json()
        const redirect = from || (data.user ? getRoleRedirect(data.user.role) : '/dashboard')
        router.push(redirect)
        router.refresh()
        return
      }
      router.push(from || '/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'Este correo ya está registrado.',
        'auth/invalid-email': 'Correo inválido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      }
      setError(messages[code || ''] || 'No se pudo completar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 md:p-8 space-y-4">
      {isRegister && (
        <label className="block">
          <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Nombre completo</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
            placeholder="Tu nombre"
          />
        </label>
      )}
      <label className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Correo electrónico</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1.5 block">Contraseña</span>
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-electric focus:ring-2 focus:ring-electric/15"
        />
      </label>

      {!isRegister && (
        <p className="text-right">
          <Link href="/recuperar-contrasena" className="text-xs text-electric font-semibold hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

      <button type="submit" disabled={loading} className="btn-cta w-full disabled:opacity-60">
        {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Entrar'}
      </button>

      <p className="text-center text-sm text-slate-500">
        {isRegister ? (
          <>¿Ya tienes cuenta? <Link href="/iniciar-sesion" className="text-electric font-semibold hover:underline">Inicia sesión</Link></>
        ) : (
          <>¿No tienes cuenta? <Link href="/registro" className="text-electric font-semibold hover:underline">Regístrate</Link></>
        )}
      </p>
    </form>
  )
}
