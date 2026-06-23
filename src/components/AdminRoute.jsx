import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      {isAdmin ? children : <Navigate to="/panel" replace />}
    </ProtectedRoute>
  )
}
