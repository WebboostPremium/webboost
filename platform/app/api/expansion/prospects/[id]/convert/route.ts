import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { DEFAULT_COMMISSION_PERCENT } from '@/lib/constants/expansion'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: prospectId } = await params
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
    const projectValue = Number(body.projectValue) || 0
    const commissionPercent = Number(body.commissionPercent) || DEFAULT_COMMISSION_PERCENT

    const prospectRef = adminDb.collection(COLLECTIONS.prospects).doc(prospectId)
    const prospectSnap = await prospectRef.get()
    if (!prospectSnap.exists) {
      return NextResponse.json({ error: 'Prospecto no encontrado' }, { status: 404 })
    }

    const prospect = prospectSnap.data()!

    // Create client user profile reference (or link by email)
    const clientRef = adminDb.collection(COLLECTIONS.users).doc()
    await clientRef.set({
      uid: clientRef.id,
      name: prospect.contactName,
      email: prospect.email,
      phone: prospect.phone,
      role: 'client',
      businessName: prospect.companyName,
      affiliateId: prospect.affiliateId,
      status: 'active',
      createdAt: new Date(),
    })

    const projectRef = adminDb.collection(COLLECTIONS.projects).doc()
    await projectRef.set({
      clientId: clientRef.id,
      prospectId,
      affiliateId: prospect.affiliateId,
      title: prospect.companyName,
      type: prospect.serviceInterest,
      status: 'demo_paid',
      progress: 10,
      projectValue,
      createdAt: new Date(),
    })

    const commissionAmount = (projectValue * commissionPercent) / 100
    const commissionRef = adminDb.collection(COLLECTIONS.commissions).doc()
    await commissionRef.set({
      affiliateId: prospect.affiliateId,
      clientId: clientRef.id,
      projectId: projectRef.id,
      prospectId,
      projectValue,
      commissionPercent,
      commissionAmount,
      status: 'pendiente',
      createdAt: new Date(),
    })

    await prospectRef.update({
      status: 'venta_cerrada',
      convertedClientId: clientRef.id,
      convertedProjectId: projectRef.id,
      updatedAt: new Date(),
    })

    await adminDb.collection(COLLECTIONS.prospectHistory).add({
      prospectId,
      actionType: 'status_change',
      comment: 'Conversión automática: cliente, proyecto y comisión creados',
      userId: session.uid,
      userName: session.name,
      previousStatus: prospect.status,
      newStatus: 'venta_cerrada',
      createdAt: new Date(),
    })

    await adminDb.collection(COLLECTIONS.auditLogs).add({
      userId: session.uid,
      userName: session.name,
      role: 'admin',
      action: 'prospect_converted',
      clientId: clientRef.id,
      projectId: projectRef.id,
      affiliateId: prospect.affiliateId,
      prospectId,
      details: `Proyecto $${projectValue}, comisión $${commissionAmount}`,
      createdAt: new Date(),
    })

    await adminDb.collection(COLLECTIONS.notifications).add({
      userId: prospect.affiliateId,
      type: 'commission_generated',
      title: '¡Venta cerrada!',
      body: `Se generó comisión de $${commissionAmount.toFixed(2)} por ${prospect.companyName}`,
      read: false,
      link: '/afiliado/dashboard/comisiones',
      createdAt: new Date(),
    })

    return NextResponse.json({
      ok: true,
      clientId: clientRef.id,
      projectId: projectRef.id,
      commissionId: commissionRef.id,
    })
  } catch (error) {
    console.error('Conversion failed:', error)
    return NextResponse.json({ error: 'Error en conversión' }, { status: 500 })
  }
}
