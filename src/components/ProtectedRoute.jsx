import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, isFirebaseConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <p className="text-slate-600 text-center">Firebase no está configurado. Contacta al administrador.</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/iniciar-sesion" state={{ from: location.pathname }} replace />
  }

  return children
}
