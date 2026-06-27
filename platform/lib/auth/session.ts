import { SignJWT, jwtVerify } from 'jose'
import type { SessionUser, UserRole } from '@/types'

const COOKIE_NAME = '__session'
const MAX_AGE = 60 * 60 * 24 * 5 // 5 days

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not configured')
  return new TextEncoder().encode(secret)
}

export { COOKIE_NAME }

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      uid: payload.uid as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    }
  } catch {
    return null
  }
}

export function sessionCookieOptions() {
  const domain = process.env.SESSION_COOKIE_DOMAIN
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: MAX_AGE,
    path: '/',
    ...(domain ? { domain } : {}),
  }
}

export function getRoleRedirect(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'affiliate':
      return '/afiliado/dashboard'
    default:
      return '/dashboard'
  }
}
