import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { sendDemoPaymentConfirmation } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: paymentId } = await params
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

    const paymentRef = adminDb.collection(COLLECTIONS.payments).doc(paymentId)
    const paymentSnap = await paymentRef.get()
    if (!paymentSnap.exists) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    const payment = paymentSnap.data()!

    await paymentRef.update({
      status: 'paid',
      paidAt: new Date(),
      updatedAt: new Date(),
    })

    if (payment.demoSessionId) {
      await adminDb.collection(COLLECTIONS.demoWizardSessions).doc(payment.demoSessionId).update({
        paymentStatus: 'paid',
        status: 'paid',
        updatedAt: new Date(),
      })
    }

    if (payment.clientEmail) {
      await sendDemoPaymentConfirmation(
        payment.clientEmail,
        payment.demoSessionId || paymentId,
        payment.amount,
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Payment confirm failed:', error)
    return NextResponse.json({ error: 'Error al confirmar pago' }, { status: 500 })
  }
}
