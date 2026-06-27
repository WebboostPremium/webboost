import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'

const ALLOWED_STATUSES = ['submitted', 'paid', 'reviewed', 'contacted', 'closed'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
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
    const update: Record<string, unknown> = { updatedAt: new Date() }

    if (body.status && ALLOWED_STATUSES.includes(body.status)) {
      update.status = body.status
    }
    if (body.adminNotes !== undefined) {
      update.adminNotes = body.adminNotes
    }

    await adminDb.collection(COLLECTIONS.demoWizardSessions).doc(id).update(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Demo session update failed:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
