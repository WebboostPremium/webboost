import type { Metadata } from 'next'
import { DemoWizard } from '@/components/expansion/DemoWizard'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Demo personalizada',
  description: `Configura tu demo personalizada por $${SITE.demoPrice} USD.`,
}

export default function DemoPage() {
  return <DemoWizard />
}
