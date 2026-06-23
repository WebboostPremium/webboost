/**
 * Envía un mensaje al bot de Telegram configurado en variables de entorno.
 * VITE_TELEGRAM_BOT_TOKEN y VITE_TELEGRAM_CHAT_ID en .env (no subir a git).
 */
export async function sendToTelegram(text) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    throw new Error('Telegram no está configurado en el servidor.')
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  })

  const data = await res.json()
  if (!data.ok) throw new Error(data.description || 'Error al enviar')
  return data
}

export function formatLeadMessage(fields) {
  const esc = (s) => String(s || '').replace(/([_*`[\]])/g, '\\$1')
  const fecha = new Date().toLocaleString('es', { dateStyle: 'full', timeStyle: 'short' })
  const line = (label, value) => (value ? `\n✅ *${label}:* ${esc(value)}` : `\n▫️ *${label}:* —`)

  return `🌐 *NUEVO LEAD — WEBBOOST*
📅 ${fecha}

━━━━━━━━━━━━━━━━━━
📬 *CONTACTO*${line('Nombre', fields.nombre)}${line('Email', fields.email)}${line('Teléfono', fields.telefono)}${line('Negocio', fields.negocio)}

━━━━━━━━━━━━━━━━━━
💼 *SOLICITUD*${line('Necesita', fields.necesidad)}${line('Plan', fields.plan)}${line('Mensaje', fields.mensaje)}
━━━━━━━━━━━━━━━━━━
_Enviado desde webbooost.com_`
}
