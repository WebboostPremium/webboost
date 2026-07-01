import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'
import { createSessionToken, COOKIE_NAME, sessionCookieOptions } from '@/lib/auth/session'
import { COLLECTIONS } from '@/lib/constants/collections'
import { ensureAffiliateRecord } from '@/lib/expansion/affiliates-admin'
import type { SessionUser, UserRole } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no configurado' }, { status: 503 })
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    const userRef = adminDb.collection(COLLECTIONS.users).doc(decoded.uid)
    const userSnap = await userRef.get()

    let role: UserRole = 'client'
    let name = decoded.name || ''

    if (userSnap.exists) {
      const data = userSnap.data()
      role = (data?.role as UserRole) || 'client'
      name = data?.name || name
    } else {
      const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      role = admins.includes((decoded.email || '').toLowerCase()) ? 'admin' : 'client'
      await userRef.set({
        uid: decoded.uid,
        name,
        email: decoded.email || '',
        role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    if (role === 'affiliate') {
      await ensureAffiliateRecord(
        adminDb,
        decoded.uid,
        name,
        decoded.email || '',
      )
    }

    const sessionUser: SessionUser = {
      uid: decoded.uid,
      email: decoded.email || '',
      name,
      role,
    }

    const token = await createSessionToken(sessionUser)
    const response = NextResponse.json({ user: sessionUser })
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions())
    return response
  } catch (error) {
    console.error('Session creation failed:', error)
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null })

  const { verifySessionToken } = await import('@/lib/auth/session')
  const user = await verifySessionToken(token)
  return NextResponse.json({ user })
}
