import { Resend } from 'resend'

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
}) {
  if (!isResendConfigured()) return { ok: false, skipped: true }

  const resend = new Resend(process.env.RESEND_API_KEY!)
  const from = process.env.EMAIL_FROM_NAME
    ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`
    : process.env.EMAIL_FROM!

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  })

  return { ok: !error, error: error?.message }
}

export async function sendDemoPaymentConfirmation(email: string, sessionId: string, amount: number) {
  return sendEmail({
    to: email,
    subject: 'Pago confirmado — Demo WebBoost',
    html: `
      <h2>¡Gracias por tu pago!</h2>
      <p>Tu demo personalizada de <strong>$${amount} USD</strong> fue confirmada.</p>
      <p>Referencia: <code>${sessionId}</code></p>
      <p>Nuestro equipo revisará tu solicitud y te contactará pronto.</p>
      <p>— WebBoost</p>
    `,
  })
}

export async function sendDemoRequestReceived(email: string, sessionId: string) {
  return sendEmail({
    to: email,
    subject: 'Solicitud de demo recibida — WebBoost',
    html: `
      <h2>Solicitud recibida</h2>
      <p>Recibimos tu configuración de demo. Completa el pago para que empecemos a trabajar.</p>
      <p>Referencia: <code>${sessionId}</code></p>
      <p>— WebBoost</p>
    `,
  })
}
