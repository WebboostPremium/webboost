import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import Layout from '../layouts/Layout'
import { auth } from '../lib/firebase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!auth) {
      setError('El servicio de autenticación no está disponible.')
      return
    }
    setStatus('loading')
    setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con ese correo.')
      } else {
        setError('No pudimos enviar el correo. Intenta de nuevo.')
      }
    }
  }

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl bg-white border border-slate-100 p-8 shadow-sm"
        >
          <Link to="/iniciar-sesion" className="inline-flex items-center gap-1 text-sm text-electric font-semibold mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
          </Link>

          <h1 className="heading-xl text-2xl text-ink mb-2">Recuperar contraseña</h1>
          <p className="text-slate-500 text-sm mb-6">
            Te enviaremos un enlace a tu correo para restablecer tu contraseña.
          </p>

          {status === 'sent' ? (
            <div className="rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
              Revisa tu bandeja de entrada. Si no ves el correo, revisa spam.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-cta w-full disabled:opacity-60">
                {status === 'loading' ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </Layout>
  )
}
