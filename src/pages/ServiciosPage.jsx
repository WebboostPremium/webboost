import PageHeader from '../components/PageHeader'
import Services from '../components/Services'
import Integrations from '../components/Integrations'
import CTA from '../components/CTA'

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        title="Servicios digitales para hacer crecer tu negocio"
        subtitle="Páginas web, plataformas completas, dashboards, catálogos online, automatización y publicidad en Google y Meta."
      />
      <Services hideIntro />
      <Integrations />
      <CTA />
    </>
  )
}
