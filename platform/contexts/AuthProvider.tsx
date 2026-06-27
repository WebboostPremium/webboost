'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase/client'
import { ensureUserProfile } from '@/lib/users/profile'
import type { UserProfile, UserRole } from '@/types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  isAffiliate: boolean
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function syncServerSession(firebaseUser: User | null) {
  if (!firebaseUser) {
    await fetch('/api/auth/logout', { method: 'POST' })
    return
  }
  const idToken = await firebaseUser.getIdToken()
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    if (user) await syncServerSession(user)
  }, [user])

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false)
      return
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const p = await ensureUserProfile(firebaseUser)
          setProfile(p)
          await syncServerSession(firebaseUser)
        } catch (err) {
          console.error('Profile sync failed:', err)
          setProfile(null)
        }
      } else {
        setProfile(null)
        await syncServerSession(null)
      }
      setLoading(false)
    })
  }, [])

  async function logout() {
    if (auth) await signOut(auth)
    await fetch('/api/auth/logout', { method: 'POST' })
    setProfile(null)
  }

  const role: UserRole | undefined = profile?.role

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: role === 'admin',
        isAffiliate: role === 'affiliate',
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
