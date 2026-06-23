import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { ensureUserProfile, ROLES } from '../lib/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null)
      return null
    }
    try {
      const p = await ensureUserProfile(authUser)
      setProfile(p)
      return p
    } catch (err) {
      console.error('Error loading profile:', err)
      setProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) await loadProfile(u)
      else setProfile(null)
      setLoading(false)
    })
  }, [loadProfile])

  async function logout() {
    if (auth) await signOut(auth)
    setProfile(null)
  }

  async function refreshProfile() {
    if (user) return loadProfile(user)
    return null
  }

  const isAdmin = profile?.role === ROLES.ADMIN

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
        refreshProfile,
        isAdmin,
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
