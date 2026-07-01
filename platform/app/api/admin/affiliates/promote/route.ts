import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { promoteUserToAffiliate } from '@/lib/expansion/affiliates-admin'

export async function POST(request: NextRequest) {
  try {
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
    const { userId, email, code, notes } = body as {
      userId?: string
      email?: string
      code?: string
      notes?: string
    }

    let targetId = userId
    if (!targetId && email) {
      const normalizedEmail = email.trim().toLowerCase()
      const usersSnap = await adminDb.collection(COLLECTIONS.users).get()
      const match = usersSnap.docs.find(
        (d) => (d.data().email || '').toLowerCase() === normalizedEmail,
      )
      if (!match) {
        return NextResponse.json({ error: 'Usuario no encontrado con ese email' }, { status: 404 })
      }
      targetId = match.id
    }

    if (!targetId) {
      return NextResponse.json({ error: 'userId o email requerido' }, { status: 400 })
    }

    const affiliate = await promoteUserToAffiliate(adminDb, targetId, { code, notes })

    await adminDb.collection(COLLECTIONS.auditLogs).add({
      userId: session.uid,
      userName: session.name,
      role: 'admin',
      action: 'affiliate_promoted',
      affiliateId: targetId,
      details: `Afiliado promovido: ${affiliate.email} (${affiliate.code})`,
      createdAt: new Date(),
    })

    return NextResponse.json({ ok: true, affiliate })
  } catch (error) {
    console.error('Promote affiliate failed:', error)
    const message = error instanceof Error ? error.message : 'Error al promover afiliado'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
