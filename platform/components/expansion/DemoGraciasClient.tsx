'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, CreditCard, MessageCircle, Loader2 } from 'lucide-react'
import { SITE } from '@/config/site'

export default function DemoGraciasClient({ sessionId, paid }: { sessionId?: string; paid?: boolean }) {
  const [loading, setLoading] = useState(Boolean(sessionId && !paid))
  const [wompiLink, setWompiLink] = useState<string | null>(null)
  const [amount, setAmount] = useState(SITE.demoPrice)
  const [manualPayment, setManualPayment] = useState(false)
  const [alreadyPaid, setAlreadyPaid] = useState(Boolean(paid))

  useEffect(() => {
    if (!sessionId || paid) return
    fetch(`/api/demo/${sessionId}/checkout`, { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (data.alreadyPaid) {
          setAlreadyPaid(true)
          return
        }
        setAmount(data.amount || SITE.demoPrice)
        setWompiLink(data.wompiLink || null)
        setManualPayment(Boolean(data.manualPayment))
      })
      .finally(() => setLoading(false))
  }, [sessionId, paid])

  return (
    <div className="pt-32 pb-20 px-5 text-center max-w-lg mx-auto">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
      <h1 className="heading-xl text-3xl text-ink">
        {alreadyPaid ? '¡Pago confirmado!' : '¡Solicitud recibida!'}
      </h1>
      <p className="text-slate-500 mt-4">
        {alreadyPaid
          ? 'Tu demo personalizada está en cola. Te contactaremos pronto.'
          : 'Tu configuración fue guardada. Completa el pago de $' + amount + ' USD para que empecemos.'}
      </p>
      {sessionId && <p className="text-xs text-slate-400 mt-2">Referencia: {sessionId}</p>}

      {!alreadyPaid && sessionId && (
        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" /> Preparando pago...
            </div>
          ) : wompiLink ? (
            <a href={wompiLink} target="_blank" rel="noopener noreferrer" className="btn-cta w-full inline-flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> Pagar ${amount} con Wompi
            </a>
          ) : manualPayment ? (
            <>
              <p className="text-sm text-slate-500">Wompi no está configurado aún. Paga por WhatsApp y envía tu referencia.</p>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-cta w-full inline-flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> Pagar por WhatsApp
              </a>
            </>
          ) : null}
        </div>
      )}

      <Link href="/dashboard" className="text-sm text-electric font-semibold mt-8 inline-block">
        Ir a mi panel →
      </Link>
    </div>
  )
}
