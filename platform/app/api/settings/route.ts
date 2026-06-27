import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { defaultSettings } from '@/lib/settings'

export async function GET() {
  const adminDb = getAdminDb()
  if (!adminDb) {
    return NextResponse.json(defaultSettings())
  }
  const snap = await adminDb.collection(COLLECTIONS.platformSettings).doc('general').get()
  return NextResponse.json(snap.exists ? { ...defaultSettings(), ...snap.data() } : defaultSettings())
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const adminDb = getAdminDb()
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin no configurado' }, { status: 503 })
  }

  const body = await request.json()
  const allowed = ['demoPrice', 'defaultCommissionPercent', 'supportWhatsapp', 'supportEmail', 'companyName']
  const payload: Record<string, unknown> = { updatedAt: new Date() }
  for (const key of allowed) {
    if (body[key] !== undefined) payload[key] = body[key]
  }

  await adminDb.collection(COLLECTIONS.platformSettings).doc('general').set(payload, { merge: true })
  return NextResponse.json({ ok: true })
}
