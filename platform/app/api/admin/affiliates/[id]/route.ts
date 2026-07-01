import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { updateAffiliateAdmin } from '@/lib/expansion/affiliates-admin'
import type { AffiliateStatus } from '@/types'

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
    const { status, code, notes } = body as {
      status?: AffiliateStatus
      code?: string
      notes?: string
    }

    await updateAffiliateAdmin(adminDb, id, { status, code, notes })

    await adminDb.collection(COLLECTIONS.auditLogs).add({
      userId: session.uid,
      userName: session.name,
      role: 'admin',
      action: 'affiliate_updated',
      affiliateId: id,
      details: `Actualizado: status=${status || '—'}, code=${code || '—'}`,
      createdAt: new Date(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Update affiliate failed:', error)
    const message = error instanceof Error ? error.message : 'Error al actualizar afiliado'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
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

    const snap = await adminDb.collection(COLLECTIONS.affiliates).doc(id).get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Afiliado no encontrado' }, { status: 404 })
    }

    const userSnap = await adminDb.collection(COLLECTIONS.users).doc(snap.data()!.userId).get()

    return NextResponse.json({
      affiliate: { id: snap.id, ...snap.data() },
      user: userSnap.exists ? { uid: userSnap.id, ...userSnap.data() } : null,
    })
  } catch (error) {
    console.error('Get affiliate failed:', error)
    return NextResponse.json({ error: 'Error al obtener afiliado' }, { status: 500 })
  }
}
