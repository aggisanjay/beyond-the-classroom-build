import { HomeHero } from "@/components/site/home-hero"
import {
  FeaturedDestinations,
  HowItWorks,
  LearningStory,
  TeacherCta,
  TrustStrip,
  WhySchoolsChooseUs,
} from "@/components/site/home-sections"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HomeHero />
        <TrustStrip />
        <FeaturedDestinations />
        <LearningStory />
        <HowItWorks />
        <WhySchoolsChooseUs />
        <TeacherCta />
      </main>
      <SiteFooter />
    </>
  )
}
