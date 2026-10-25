"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Compass,
  Globe2,
  GraduationCap,
  Landmark,
  Lightbulb,
  Plane,
  Building,
  Building2,
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { RegistrationForm } from "@/components/forms/registration-form"
import { Reveal } from "@/components/site/motion-reveal"
import { destinations } from "@/lib/trips/data"

// Section C — Trust and value strip (5 items with vertical divider lines)
const trustValues = [
  {
    icon: GraduationCap,
    title: "CURATED ITINERARIES",
    subtitle: "Age-appropriate, educational & safe",
  },
  {
    icon: Users,
    title: "REAL-WORLD LEARNING",
    subtitle: "Culture, innovation & global exposure",
  },
  {
    icon: ShieldCheck,
    title: "SAFE & SUPPORTED",
    subtitle: "Expert guides & school coordination",
  },
  {
    icon: Globe2,
    title: "GLOBAL DESTINATIONS",
    subtitle: "Iconic cities, unique experiences",
  },
  {
    icon: Star,
    title: "TRUSTED BY SCHOOLS",
    subtitle: "Memorable, impactful journeys",
  },
]

export function TrustStrip() {
  return (
    <section className="value-strip" id="trust" aria-label="Our core principles">
      <div className="section-shell">
        <div className="value-strip__grid">
          {trustValues.map(({ icon: Icon, title, subtitle }, index) => (
            <div key={title} className="value-strip__item-wrapper">
              <Reveal delay={index * 0.08} direction="up" className="w-full">
                <div className="value-strip__card">
                  <span className="value-strip__icon-wrap">
                    <Icon size={22} className="value-strip__icon" />
                  </span>
                  <div className="value-strip__text">
                    <strong>{title}</strong>
                    <span>{subtitle}</span>
                  </div>
                </div>
              </Reveal>
              {index < trustValues.length - 1 && (
                <div className="value-strip__divider" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Section D — Featured destinations (Singapore, Jaipur, London with colored badges and adjusted day preview stops)
const destinationStops: Record<string, { icon: typeof Plane; name: string; day: string }[]> = {
  "singapore-stem": [
    { icon: Plane, name: "Visit Science Centre", day: "Day 1" },
    { icon: Building2, name: "Explore Marina Bay", day: "Day 2" },
    { icon: Users, name: "Industry Visit", day: "Day 3" },
  ],
  "jaipur-heritage": [
    { icon: Landmark, name: "Amber Fort Tour", day: "Day 1" },
    { icon: Building, name: "City Palace Visit", day: "Day 2" },
    { icon: Sparkles, name: "Cultural Workshop", day: "Day 3" },
  ],
  "london-universities": [
    { icon: Building2, name: "University Campus Tour", day: "Day 1" },
    { icon: Landmark, name: "British Museum", day: "Day 2" },
    { icon: Users, name: "Student Interaction", day: "Day 3" },
  ],
}

const destinationBadges: Record<
  string,
  { label: string; icon: typeof Sparkles; badgeClass: string }
> = {
  "singapore-stem": {
    label: "STEM & INNOVATION",
    icon: Sparkles,
    badgeClass: "dest-badge--cyan",
  },
  "jaipur-heritage": {
    label: "HISTORY & HERITAGE",
    icon: Landmark,
    badgeClass: "dest-badge--amber",
  },
  "london-universities": {
    label: "GLOBAL EDUCATION",
    icon: GraduationCap,
    badgeClass: "dest-badge--blue",
  },
}

export function FeaturedDestinations() {
  return (
    <section className="section destinations-section" id="destinations">
      <div className="section-shell">
        <div className="destinations-header-row">
          <Reveal direction="left">
            <p className="eyebrow"><span className="eyebrow__line" /> POPULAR DESTINATIONS</p>
            <h2 className="section-title">
              FIELD TRIPS. <span className="title-highlight">REAL-WORLD DISCOVERY.</span>
            </h2>
          </Reveal>
          <Reveal direction="right" className="destinations-header-right">
            <p className="destinations-header-copy">
              From futuristic cities to historic landmarks, our school trips are designed to inspire curiosity, build global perspectives and create lifelong memories.
            </p>
            <Link href="/#school-trips" className="button button--small button--outline">
              VIEW ALL DESTINATIONS <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="destination-cards-grid">
          {destinations.map((trip, index) => {
            const badge = destinationBadges[trip.slug] ?? {
              label: trip.theme,
              icon: Sparkles,
              badgeClass: "dest-badge--cyan",
            }
            const BadgeIcon = badge.icon
            const stops = destinationStops[trip.slug] ?? []

            return (
              <Reveal key={trip.slug} delay={index * 0.12} direction="up">
                <Link href={`/trips/${trip.slug}`} className="dest-card-interactive">
                  <div className="dest-card-media">
                    <Image
                      src={trip.cardImage}
                      alt={trip.cardAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="dest-card-image"
                    />
                    <div className="dest-card-overlay" />
                    
                    {/* Colored Destination Badge */}
                    <div className={`dest-card-badge ${badge.badgeClass}`}>
                      <BadgeIcon size={14} />
                      <span>{badge.label}</span>
                    </div>

                    {/* Destination Title & Circle Arrow Button */}
                    <div className="dest-card-bottom-banner">
                      <div className="dest-card-titles">
                        <h3>{trip.city.toUpperCase()}</h3>
                        <span>{trip.shortName === "London" ? "UNIVERSITIES" : trip.shortName === "Singapore" ? "STEM" : "HERITAGE"}</span>
                      </div>
                      <div className="dest-card-circle-arrow">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Day Stops Preview Strip: 3 Clean Columns with Stacked Name & Day */}
                  <div className="dest-card-stops-strip">
                    {stops.map((stop, sIdx) => {
                      const StopIcon = stop.icon
                      return (
                        <div key={sIdx} className="dest-card-stop-col">
                          <div className="stop-header-row">
                            <StopIcon size={13} className="stop-icon" />
                            <span className="stop-name" title={stop.name}>
                              {stop.name}
                            </span>
                          </div>
                          <span className="stop-day">{stop.day}</span>
                        </div>
                      )
                    })}
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Section E — Why Educational Travel Matters (Panel 2 in reference image)
export function LearningStory() {
  return (
    <section className="section story-banner-section" id="why-travel">
      <span id="about" className="sr-only" />
      <div className="story-banner-container">
        {/* Full width scenic backdrop */}
        <div className="story-banner-bg" aria-hidden="true">
          <Image
            src="/images/japan-learning-story.webp"
            alt="Scenic view of Lake Kawaguchi, Torii gate and Mount Fuji"
            fill
            sizes="100vw"
            className="story-bg-img"
          />
          <div className="story-banner-gradient" />
        </div>

        <div className="section-shell story-banner-content">
          <div className="story-banner-left">
            <Reveal direction="left">
              <p className="eyebrow"><span className="eyebrow__line" /> WHY EDUCATIONAL TRAVEL MATTERS</p>
              <h2 className="story-banner-title">
                CREATE MEMORIES<br />THAT LAST A<br />LIFETIME
              </h2>
              <p className="story-banner-desc">
                More than just a trip, educational travel is a powerful way to spark curiosity, build global perspectives and prepare students for a brighter future.
              </p>
              <Link href="/#destinations" className="button button--red story-cta-btn">
                DISCOVER EXPERIENCES <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          <div className="story-banner-right">
            {/* Card 1 */}
            <Reveal direction="right" delay={0.1}>
              <div className="story-feature-card">
                <div className="feature-card-media">
                  <Image
                    src="/images/trips/singapore/gardens-by-the-bay.webp"
                    alt="Gardens by the Bay"
                    fill
                    sizes="120px"
                  />
                </div>
                <div className="feature-card-body">
                  <div className="feature-title-row">
                    <Lightbulb size={18} className="feature-icon" />
                    <strong>Real-World Learning</strong>
                  </div>
                  <p>Turn classroom concepts into hands-on experiences.</p>
                </div>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal direction="right" delay={0.2}>
              <div className="story-feature-card">
                <div className="feature-card-media">
                  <Image
                    src="/images/trips/jaipur/city-palace.webp"
                    alt="City Palace Jaipur"
                    fill
                    sizes="120px"
                  />
                </div>
                <div className="feature-card-body">
                  <div className="feature-title-row">
                    <Landmark size={18} className="feature-icon" />
                    <strong>Cultural Understanding</strong>
                  </div>
                  <p>Explore history, heritage and people beyond textbooks.</p>
                </div>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal direction="right" delay={0.3}>
              <div className="story-feature-card">
                <div className="feature-card-media">
                  <Image
                    src="/images/trips/london/british-museum.webp"
                    alt="British Museum London"
                    fill
                    sizes="120px"
                  />
                </div>
                <div className="feature-card-body">
                  <div className="feature-title-row">
                    <GraduationCap size={18} className="feature-icon" />
                    <strong>Future-Ready Skills</strong>
                  </div>
                  <p>Inspire new perspectives and broader career aspirations.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section F — How School Trips Work (Using Kyoto evening street with illuminated pagoda and continuous centered line)
const processSteps = [
  {
    number: "01",
    title: "Explore Destinations",
    copy: "Discover curated itineraries designed for student learning.",
  },
  {
    number: "02",
    title: "Register Interest",
    copy: "Tell us about your school and preferred trip.",
  },
  {
    number: "03",
    title: "Discuss & Plan",
    copy: "Our team will connect with you to share options and next steps.",
  },
]

export function HowItWorks() {
  return (
    <section className="section how-it-works-banner" id="how-it-works">
      {/* Background Image: Kyoto historic pagoda evening streetscape matching reference */}
      <div className="how-it-works-bg" aria-hidden="true">
        <Image
          src="/images/kyoto-pagoda-sunset.jpg"
          alt="Atmospheric Japanese evening streetscape in Kyoto with pagoda and lanterns"
          fill
          sizes="100vw"
          className="how-bg-image"
          priority
        />
        <div className="how-it-works-overlay" />
      </div>

      <div className="section-shell how-it-works-content">
        <Reveal direction="up" className="how-it-works-header">
          <p className="eyebrow"><span className="eyebrow__line" /> HOW SCHOOL TRIPS WORK</p>
          <h2 className="how-title">A SIMPLE JOURNEY TO GLOBAL DISCOVERY</h2>
          <p className="how-subtitle">
            From curiosity to confirmation, we make it easy for schools to plan meaningful international learning experiences.
          </p>
        </Reveal>

        {/* Continuous track connecting all 3 step circles */}
        <div className="how-steps-track">
          <div className="how-connecting-bar" aria-hidden="true" />
          <div className="how-steps-grid">
            {processSteps.map((step, idx) => (
              <Reveal key={step.number} delay={idx * 0.15} direction="up" className="how-step-col">
                <div className="step-circle-badge">
                  <span>{step.number}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Section G & H — Integrated components
export function WhySchoolsChooseUs() {
  return null
}

// Section H — Get in Touch / Teacher Enquiry Section
export function TeacherCta() {
  return (
    <section className="section landing-contact-section" id="contact" aria-labelledby="contact-title">
      <span id="get-in-touch" className="sr-only">Get in Touch</span>
      <div className="section-shell">
        <div className="landing-contact-header">
          <Reveal direction="up">
            <p className="eyebrow"><span className="eyebrow__line" /> GET IN TOUCH / START A CONVERSATION</p>
            <h2 id="contact-title" className="landing-contact-title">
              Your Students&apos; Next Great Lesson Starts Here.
            </h2>
            <p className="landing-contact-subtitle">
              Tell us about your school, student cohort, and the educational journey you have in mind. We&apos;ll help design a meaningful, safe, and curriculum-aligned experience.
            </p>
          </Reveal>
        </div>

        <div className="landing-contact-card">
          {/* Left Column: Visual Media & Advisory Highlights */}
          <Reveal direction="left" className="landing-contact-left">
            <div className="landing-contact-media" aria-hidden="true">
              <Image
                src="/images/kyoto-pagoda-sunset.jpg"
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className="landing-contact-bg-img"
              />
              <div className="landing-contact-overlay" />
            </div>

            <div className="landing-contact-left-content">
              <div className="landing-contact-pill">
                <Sparkles size={14} className="landing-contact-pill-icon" aria-hidden="true" />
                <span>SCHOOL &amp; TEACHER INQUIRY</span>
              </div>

              <h3>Plan with Confidence &amp; Full Support</h3>
              <p className="landing-contact-desc">
                Every journey is curated with academic rigor, logistical excellence, and the highest standards of student safety.
              </p>

              <div className="landing-contact-benefits">
                <div className="landing-benefit-row">
                  <div className="landing-benefit-icon">
                    <GraduationCap size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>Curriculum-Aligned Learning</strong>
                    <span>Tailored for STEM, Heritage &amp; Culture, and Global Higher Education exposure.</span>
                  </div>
                </div>

                <div className="landing-benefit-row">
                  <div className="landing-benefit-icon">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>24/7 Safety &amp; On-Ground Support</strong>
                    <span>Comprehensive risk assessments, vetted local partners &amp; dedicated coordinators.</span>
                  </div>
                </div>

                <div className="landing-benefit-row">
                  <div className="landing-benefit-icon">
                    <CheckCircle2 size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>Zero-Commitment Consultation</strong>
                    <span>Submitting interest records an initial inquiry only; no booking or payment required.</span>
                  </div>
                </div>
              </div>

              <div className="landing-contact-note">
                <span className="landing-contact-dot" aria-hidden="true" />
                <span>Our educational travel team responds within 1 business day.</span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Embedded Registration Form */}
          <Reveal direction="right" className="landing-contact-right">
            <div className="landing-contact-form-wrapper">
              <div className="landing-form-header">
                <h3>Submit School Interest</h3>
                <p>Fill out the details below to receive a customized proposed itinerary.</p>
              </div>
              <RegistrationForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// Alias export for clarity
export { TeacherCta as GetInTouchSection }
