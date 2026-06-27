import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/constants/collections'
import { SITE } from '@/config/site'
import { DEFAULT_COMMISSION_PERCENT } from '@/lib/constants/expansion'

export type PlatformSettings = {
  demoPrice: number
  defaultCommissionPercent: number
  supportWhatsapp: string
  supportEmail: string
  companyName: string
  updatedAt?: unknown
}

const SETTINGS_DOC = 'general'

export function defaultSettings(): PlatformSettings {
  return {
    demoPrice: SITE.demoPrice,
    defaultCommissionPercent: DEFAULT_COMMISSION_PERCENT,
    supportWhatsapp: SITE.whatsapp,
    supportEmail: SITE.email,
    companyName: SITE.name,
  }
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  if (!db) return defaultSettings()
  const snap = await getDoc(doc(db, COLLECTIONS.platformSettings, SETTINGS_DOC))
  if (!snap.exists()) return defaultSettings()
  return { ...defaultSettings(), ...snap.data() } as PlatformSettings
}

export async function savePlatformSettings(data: Partial<PlatformSettings>) {
  if (!db) throw new Error('Firestore no disponible')
  await setDoc(
    doc(db, COLLECTIONS.platformSettings, SETTINGS_DOC),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  )
}

export function integrationStatus() {
  return {
    firebase: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    wompi: Boolean(process.env.WOMPI_CLIENT_ID && process.env.WOMPI_CLIENT_SECRET),
    resend: Boolean(process.env.RESEND_API_KEY),
    cloudinary: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
    firebaseAdmin: Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY),
  }
}
