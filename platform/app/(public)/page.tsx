import { Hero } from '@/components/home/Hero'
import { ServicesSection } from '@/components/home/ServicesSection'
import { StepsSection } from '@/components/home/StepsSection'
import { StatsSection } from '@/components/home/StatsSection'
import { AppsSection } from '@/components/home/AppsSection'
import { PricingSection, TestimonialsSection, CTASection } from '@/components/home/PricingSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <StepsSection />
      <StatsSection />
      <AppsSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
