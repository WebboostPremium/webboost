import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'
import { COLLECTIONS } from '@/lib/constants/collections'
import { createWompiPaymentLink } from '@/lib/wompi'
import { sendDemoRequestReceived } from '@/lib/email'
import { SITE } from '@/config/site'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: sessionId } = await params
    const adminDb = getAdminDb()
    if (!adminDb) {
      return NextResponse.json({ error: 'Servidor no configurado' }, { status: 503 })
    }

    const sessionRef = adminDb.collection(COLLECTIONS.demoWizardSessions).doc(sessionId)
    const sessionSnap = await sessionRef.get()
    if (!sessionSnap.exists) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    const session = sessionSnap.data()!
    if (session.paymentStatus === 'paid') {
      return NextResponse.json({ ok: true, alreadyPaid: true })
    }

    const email = session.email || session.data?.businessInfo?.email
    const businessName = session.data?.businessInfo?.name || 'Demo WebBoost'
    const amount = session.amount || SITE.demoPrice
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const existing = await adminDb
      .collection(COLLECTIONS.payments)
      .where('demoSessionId', '==', sessionId)
      .limit(1)
      .get()

    let paymentId: string
    let wompiLink: string | null = null
    let wompiTransactionId: string | undefined

    if (!existing.empty) {
      const doc = existing.docs[0]
      paymentId = doc.id
      wompiLink = doc.data().wompiLink || null
      if (wompiLink) {
        return NextResponse.json({ ok: true, paymentId, wompiLink, amount })
      }
    } else {
      const paymentRef = adminDb.collection(COLLECTIONS.payments).doc()
      paymentId = paymentRef.id
      await paymentRef.set({
        clientEmail: email,
        clientId: session.userId || '',
        demoSessionId: sessionId,
        amount,
        currency: 'USD',
        type: 'demo',
        status: 'pending',
        description: `Demo personalizada — ${businessName}`,
        createdAt: new Date(),
      })
    }

    const wompi = await createWompiPaymentLink({
      amount,
      reference: paymentId,
      customerEmail: email,
      description: `Demo WebBoost — ${businessName}`,
      redirectUrl: `${appUrl}/demo/gracias?id=${sessionId}&paid=1`,
    })

    wompiLink = wompi.url
    wompiTransactionId = wompi.transactionId

    await adminDb.collection(COLLECTIONS.payments).doc(paymentId).update({
      wompiLink: wompiLink || '',
      wompiTransactionId: wompiTransactionId || '',
      updatedAt: new Date(),
    })

    if (email) {
      await sendDemoRequestReceived(email, sessionId)
    }

    return NextResponse.json({
      ok: true,
      paymentId,
      wompiLink,
      amount,
      manualPayment: !wompiLink,
      whatsapp: SITE.whatsapp,
    })
  } catch (error) {
    console.error('Checkout failed:', error)
    return NextResponse.json({ error: 'Error al procesar pago' }, { status: 500 })
  }
}
