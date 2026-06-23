import PageHeader from '../components/PageHeader'
import LeadForm from '../components/LeadForm'

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        title="Hablemos de tu proyecto"
        subtitle="Cuéntanos tu idea y te respondemos en menos de 24 horas con una propuesta personalizada."
      />
      <LeadForm hideHeader />
    </>
  )
}
