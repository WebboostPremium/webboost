import PageHeader from '../components/PageHeader'
import Portfolio from '../components/Portfolio'
import CTA from '../components/CTA'

export default function PortafolioPage() {
  return (
    <>
      <PageHeader
        title="Proyectos que rankean y venden"
        subtitle="Sitios web, plataformas y sistemas reales para negocios de todos los sectores."
      />
      <Portfolio hideIntro />
      <CTA />
    </>
  )
}
