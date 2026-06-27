export function isWompiConfigured() {
  return Boolean(
    process.env.WOMPI_CLIENT_ID &&
    process.env.WOMPI_CLIENT_SECRET &&
    process.env.WOMPI_AUTH_URL &&
    process.env.WOMPI_API_URL,
  )
}

async function getWompiAccessToken(): Promise<string | null> {
  if (!isWompiConfigured()) return null

  const credentials = Buffer.from(
    `${process.env.WOMPI_CLIENT_ID}:${process.env.WOMPI_CLIENT_SECRET}`,
  ).toString('base64')

  const res = await fetch(process.env.WOMPI_AUTH_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) return null
  const data = (await res.json()) as { access_token?: string }
  return data.access_token || null
}

export async function createWompiPaymentLink(params: {
  amount: number
  currency?: string
  reference: string
  customerEmail: string
  description: string
  redirectUrl: string
}): Promise<{ url: string | null; transactionId?: string }> {
  if (!isWompiConfigured()) return { url: null }

  const token = await getWompiAccessToken()
  if (!token) return { url: null }

  const amountInCents = Math.round(params.amount * 100)

  const res = await fetch(`${process.env.WOMPI_API_URL}/payment_links`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: params.description,
      description: params.description,
      single_use: true,
      collect_shipping: false,
      currency: params.currency || 'USD',
      amount_in_cents: amountInCents,
      reference: params.reference,
      redirect_url: params.redirectUrl,
      customer_email: params.customerEmail,
    }),
  })

  if (!res.ok) return { url: null }

  const data = (await res.json()) as {
    data?: { id?: string; payment_link_url?: string; url?: string }
  }

  return {
    url: data.data?.payment_link_url || data.data?.url || null,
    transactionId: data.data?.id,
  }
}
