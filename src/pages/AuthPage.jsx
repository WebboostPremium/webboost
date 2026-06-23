import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { motion } from 'framer-motion'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { SITE } from '../config/site'

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isRegister = mode === 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isFirebaseConfigured || !auth) {
      setError('Firebase no está configurado. Agrega las variables en el archivo .env')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      const from = location.state?.from || '/panel'
      navigate(from)
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'Este correo ya está registrado.',
        'auth/invalid-email': 'Correo inválido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
        'auth/user-not-found': 'No existe una cuenta con este correo.',
      }
      setError(messages[err.code] || 'No se pudo completar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-32 md:pt-36 pb-20 px-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="heading-xl text-3xl md:text-4xl text-ink">
            {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
          </h1>
          <p className="mt-3 text-slate-500 text-sm">
            {isRegister
              ? `Regístrate en ${SITE.name} para gestionar tu proyecto y acceder a beneficios.`
              : 'Accede a tu cuenta de WebBooost.'}
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 md:p-8 space-y-4"
        >
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
              placeholder="correo@ejemplo.com"
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
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          {!isRegister && (
            <p className="text-right">
              <Link to="/recuperar-contrasena" className="text-xs text-electric font-semibold hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-cta w-full disabled:opacity-60">
            {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-slate-500">
            {isRegister ? (
              <>¿Ya tienes cuenta? <Link to="/iniciar-sesion" className="text-electric font-semibold hover:underline">Inicia sesión</Link></>
            ) : (
              <>¿No tienes cuenta? <Link to="/registro" className="text-electric font-semibold hover:underline">Regístrate</Link></>
            )}
          </p>
        </motion.form>
      </div>
    </section>
  )
}
