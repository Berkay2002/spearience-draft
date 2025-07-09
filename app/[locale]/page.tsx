import { HeroSection } from '@/components/sections/hero-section'
import { ExpertiseTabs } from '@/components/sections/expertise-tabs'
import { ProcessShowcase } from '@/components/sections/process-showcase'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FeaturedWork } from '@/components/sections/featured-work'
import { Footerdemo } from '@/components/ui/footer-section'
// import { CookieConsent } from '@/components/cookie-consent'
import { type Locale } from '@/lib/i18n'

interface HomePageProps {
  params: {
    locale: Locale
  }
}

export default function HomePage({ params }: HomePageProps) {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Areas of Expertise */}
      <ExpertiseTabs />
      
      {/* My Process in Action */}
      <ProcessShowcase />
      
      {/* What Clients Say */}
      <TestimonialsSection />
      
      {/* Featured Work */}
      <FeaturedWork />
      
      {/* Site Footer */}
      <Footerdemo />
      
      {/* Cookie Consent Banner */}
      {/* <CookieConsent /> */}
    </>
  )
} 