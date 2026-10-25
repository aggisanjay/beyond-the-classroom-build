"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Camera,
  Clock,
  Compass,
  Globe2,
  GraduationCap,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { Reveal } from "@/components/site/motion-reveal"
import { RegistrationForm } from "@/components/forms/registration-form"
import type { TripDestination } from "@/lib/trips/data"

type DestinationThemeConfig = {
  tagline: string
  themeBadge: string
  featuresHeadline: string
  galleryHeadline: string
  facts: {
    duration: string
    age: string
    theme: string
    perspective: string
  }
  features: { icon: typeof Sparkles; title: string }[]
}

const destinationConfigs: Record<string, DestinationThemeConfig> = {
  "singapore-stem": {
    tagline: "DISCOVER. INNOVATE. EXPLORE.",
    themeBadge: "STEM & Innovation",
    featuresHeadline: "7 AMAZING PLACES TO EXPLORE",
    galleryHeadline: "A CITY OF INNOVATION AND WONDER",
    facts: {
      duration: "3 Days (Proposed Itinerary)",
      age: "Ages 12-18 (Suggested)",
      theme: "STEM & Innovation",
      perspective: "Global Perspectives",
    },
    features: [
      { icon: Sparkles, title: "World-Class Science Learning" },
      { icon: Compass, title: "Sustainable Future Solutions" },
      { icon: GraduationCap, title: "University Exposure & Career Inspiration" },
      { icon: ShieldCheck, title: "Safe & Student-Friendly Itinerary" },
    ],
  },
  "jaipur-heritage": {
    tagline: "HISTORY. CULTURE. PERSPECTIVE.",
    themeBadge: "History & Heritage",
    featuresHeadline: "7 ICONIC PLACES TO EXPLORE",
    galleryHeadline: "THE COLORS OF JAIPUR",
    facts: {
      duration: "3 Days (Proposed Itinerary)",
      age: "Ages 12-18 (Suggested)",
      theme: "History & Heritage",
      perspective: "Cultural Learning",
    },
    features: [
      { icon: Landmark, title: "Royal Heritage Sites" },
      { icon: Compass, title: "Architectural Marvels" },
      { icon: Sparkles, title: "Traditional Arts & Crafts" },
      { icon: Users, title: "Local Culture Experience" },
    ],
  },
  "london-universities": {
    tagline: "EXPLORE. LEARN. BE INSPIRED.",
    themeBadge: "Universities & Careers",
    featuresHeadline: "7 INCREDIBLE PLACES TO EXPLORE",
    galleryHeadline: "A CITY OF HISTORY AND OPPORTUNITY",
    facts: {
      duration: "3 Days (Proposed Itinerary)",
      age: "Ages 14-18 (Suggested)",
      theme: "Universities & Careers",
      perspective: "Global Perspectives",
    },
    features: [
      { icon: GraduationCap, title: "World-Renowned Universities" },
      { icon: Landmark, title: "Historic Landmarks" },
      { icon: Sparkles, title: "Science & Innovation Museums" },
      { icon: Globe2, title: "Global Learning Opportunities" },
    ],
  },
}

export function DestinationExperience({ trip }: { trip: TripDestination }) {
  const config = destinationConfigs[trip.slug] ?? {
    tagline: "DISCOVER & LEARN",
    themeBadge: trip.theme,
    featuresHeadline: "7 AMAZING PLACES TO EXPLORE",
    galleryHeadline: `DISCOVER ${trip.city.toUpperCase()}`,
    facts: {
      duration: trip.proposedDuration,
      age: trip.suggestedAgeRange,
      theme: trip.theme,
      perspective: "Global Perspectives",
    },
    features: [
      { icon: Sparkles, title: "World-Class Learning" },
      { icon: Compass, title: "Curated Itineraries" },
      { icon: GraduationCap, title: "Academic Insights" },
      { icon: ShieldCheck, title: "Safe & Supported" },
    ],
  }

  // Flatten all stops from the 3 days to get 7 distinct stops
  const allStops = trip.days.flatMap((d) => d.stops)

  return (
    <>
      <SiteHeader />
      <main className="destination-detail-page">
        {/* Destination Hero */}
        <section className="dest-hero-section">
          <div className="dest-hero-bg" aria-hidden="true">
            <Image
              src={trip.heroImage}
              alt={trip.heroAlt}
              fill
              priority
              sizes="100vw"
              className="dest-hero-img"
            />
            <div className="dest-hero-gradient" />
          </div>

          <div className="section-shell dest-hero-container">
            <div className="dest-hero-left">
              <Reveal direction="left">
                <span className="dest-hero-eyebrow">SCHOOL TRIP</span>
                <h1 className="dest-hero-title">{trip.title.toUpperCase()}</h1>
                <p className="dest-hero-tagline">{config.tagline}</p>
                <p className="dest-hero-summary">{trip.summary}</p>
                <div className="dest-hero-cta">
                  <a href="#register" className="button button--red">
                    Register School Interest <ArrowRight size={16} />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Floating Facts Card */}
            <div className="dest-hero-right">
              <Reveal direction="right" delay={0.15}>
                <div className="dest-facts-card">
                  <div className="dest-fact-row">
                    <span className="dest-fact-icon"><Clock size={18} /></span>
                    <div>
                      <strong>{config.facts.duration}</strong>
                    </div>
                  </div>
                  <div className="dest-fact-row">
                    <span className="dest-fact-icon"><Users size={18} /></span>
                    <div>
                      <strong>{config.facts.age}</strong>
                    </div>
                  </div>
                  <div className="dest-fact-row">
                    <span className="dest-fact-icon"><Sparkles size={18} /></span>
                    <div>
                      <strong>{config.facts.theme}</strong>
                    </div>
                  </div>
                  <div className="dest-fact-row">
                    <span className="dest-fact-icon"><Globe2 size={18} /></span>
                    <div>
                      <strong>{config.facts.perspective}</strong>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 4 Feature Highlights Strip */}
        <section className="dest-features-strip">
          <div className="section-shell">
            <div className="dest-features-grid">
              {config.features.map(({ icon: Icon, title }, idx) => (
                <Reveal key={title} delay={idx * 0.08} direction="up" className="dest-feature-item">
                  <span className="dest-feature-icon-wrap"><Icon size={20} /></span>
                  <span>{title}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7 Places Itinerary Highlights Grid (4 top, 3 bottom) */}
        <section className="section dest-stops-section" id="itinerary">
          <div className="section-shell">
            <div className="dest-stops-header">
              <Reveal direction="left">
                <p className="eyebrow"><span className="eyebrow__line" /> ITINERARY HIGHLIGHTS</p>
                <h2 className="section-title">{config.featuresHeadline}</h2>
              </Reveal>
              <Reveal direction="right">
                <a href="#register" className="button button--small button--outline">
                  View Full Itinerary <ArrowRight size={14} />
                </a>
              </Reveal>
            </div>

            <div className="dest-stops-grid">
              {allStops.map((stop, sIdx) => (
                <Reveal
                  key={stop.title}
                  delay={sIdx * 0.07}
                  direction="up"
                  className={`dest-stop-card${sIdx >= 4 ? " dest-stop-card--bottom" : ""}`}
                >
                  <div className="stop-card-media">
                    <Image
                      src={stop.image}
                      alt={stop.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="stop-card-img"
                    />
                    <div className="stop-card-badge">0{sIdx + 1}</div>
                  </div>
                  <div className="stop-card-content">
                    <h3>{stop.title}</h3>
                    <p>{stop.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery Grid (5 Photos) */}
        <section className="section dest-gallery-section">
          <div className="section-shell">
            <div className="dest-stops-header">
              <Reveal direction="left">
                <p className="eyebrow"><span className="eyebrow__line" /> PHOTO GALLERY</p>
                <h2 className="section-title">{config.galleryHeadline}</h2>
              </Reveal>
              <Reveal direction="right">
                <div className="dest-gallery-badge">
                  <Camera size={14} className="dest-gallery-badge-icon" />
                  <span>5 Curated Moments</span>
                </div>
              </Reveal>
            </div>

            <div className="dest-gallery-grid">
              {trip.gallery.slice(0, 5).map((img, gIdx) => (
                <Reveal
                  key={img.image}
                  delay={gIdx * 0.08}
                  direction="up"
                  className={`gallery-item-tile gallery-tile--${gIdx + 1}`}
                >
                  <Image
                    src={img.image}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="gallery-tile-img"
                  />
                  <div className="gallery-tile-overlay" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Embedded Registration Form Section (Panel 4) */}
        <section className="section dest-register-embed-section" id="register">
          <div className="section-shell">
            <div className="dest-register-embed-layout">
              {/* Left Promo Image & Heading */}
              <Reveal direction="left" className="register-embed-left">
                <div className="register-embed-media" aria-hidden="true">
                  <Image
                    src={trip.heroImage}
                    alt=""
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                    className="register-embed-bg"
                  />
                  <div className="register-embed-shade" />
                </div>
                <div className="register-embed-text">
                  <h2>Plan Your<br />{trip.city} School Trip</h2>
                  <p>Register your school&apos;s interest and let us help you create a meaningful learning experience.</p>
                </div>
              </Reveal>

              {/* Right Form Container */}
              <Reveal direction="right" className="register-embed-right">
                <div className="register-embed-form-card">
                  <RegistrationForm initialTrip={trip.slug} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
