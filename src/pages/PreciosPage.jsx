import PageHeader from '../components/PageHeader'
import Pricing from '../components/Pricing'
import Faq from '../components/Faq'
import CTA from '../components/CTA'

export default function PreciosPage() {
  return (
    <>
      <PageHeader
        title="Planes claros, sin sorpresas"
        subtitle="Elige el plan ideal para tu etapa. Sin contratos largos. Escala cuando lo necesites."
      />
      <Pricing hideIntro />
      <Faq />
      <CTA />
    </>
  )
}
