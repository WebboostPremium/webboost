import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { sendDemoPaymentConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const adminDb = getAdminDb()
    if (!adminDb) {
      return NextResponse.json({ error: 'Servidor no configurado' }, { status: 503 })
    }

    const body = await request.json()
    const reference = body.reference || body.data?.transaction?.reference
    const status = body.status || body.data?.transaction?.status
    const transactionId = body.transactionId || body.data?.transaction?.id

    if (!reference) {
      return NextResponse.json({ error: 'Referencia inválida' }, { status: 400 })
    }

    const paymentRef = adminDb.collection(COLLECTIONS.payments).doc(reference)
    const paymentSnap = await paymentRef.get()
    if (!paymentSnap.exists) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    const payment = paymentSnap.data()!
    const isPaid = status === 'APPROVED' || status === 'paid' || status === 'approved'

    if (!isPaid) {
      await paymentRef.update({ status: 'failed', updatedAt: new Date() })
      return NextResponse.json({ ok: true, status: 'ignored' })
    }

    await paymentRef.update({
      status: 'paid',
      wompiTransactionId: transactionId || payment.wompiTransactionId || '',
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
      await sendDemoPaymentConfirmation(payment.clientEmail, payment.demoSessionId || reference, payment.amount)
    }

    await adminDb.collection(COLLECTIONS.notifications).add({
      userId: '__admins__',
      role: 'admin',
      type: 'demo_paid',
      title: 'Demo pagada',
      body: `$${payment.amount} — ${payment.description || 'Demo personalizada'}`,
      read: false,
      link: '/admin/demos',
      createdAt: new Date(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Wompi webhook failed:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
