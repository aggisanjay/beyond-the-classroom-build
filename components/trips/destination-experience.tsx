import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BookOpen, Check, MapPin } from "lucide-react"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { Reveal } from "@/components/site/motion-reveal"
import { ItineraryTimeline } from "@/components/trips/itinerary-timeline"
import type { TripDestination } from "@/lib/trips/data"
import { destinations } from "@/lib/trips/data"

export function DestinationExperience({ trip }: { trip: TripDestination }) {
  const related = destinations.filter((destination) => destination.slug !== trip.slug)

  return (
    <>
      <SiteHeader />
      <main className="destination-page">
        <section className="destination-hero">
          <Image src={trip.heroImage} alt={trip.heroAlt} fill priority sizes="100vw" className="destination-hero__image" />
          <div className="destination-hero__shade" />
          <div className="section-shell destination-hero__content">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/#destinations">Destinations</Link><span aria-hidden="true">/</span><span aria-current="page">{trip.city}</span>
            </nav>
            <div className="destination-hero__copy">
              <p className="eyebrow"><span className="eyebrow__line" /> {trip.theme.toUpperCase()}</p>
              <h1>{trip.title}<span>.</span></h1>
              <p>{trip.summary}</p>
              <div className="destination-hero__actions">
                <Link className="button button--red" href={`/register?trip=${trip.slug}`}>
                  Register interest <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a className="button button--glass" href="#itinerary">View proposed itinerary <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="destination-hero__index"><span>FIELD GUIDE</span><strong>{trip.city.toUpperCase()}</strong><span>BEYOND THE CLASSROOM / 2026</span></div>
          </div>
        </section>

        <div className="destination-facts">
          <div className="section-shell destination-facts__inner">
            <div><span>PROPOSED DURATION</span><strong>{trip.proposedDuration}</strong></div>
            <div><span>STUDENT AGE</span><strong>{trip.suggestedAgeRange}</strong></div>
            <div><span>LEARNING THEMES</span><strong>{trip.theme}</strong></div>
          </div>
        </div>

        <section className="section destination-intro">
          <div className="section-shell destination-intro__grid">
            <Reveal>
              <p className="eyebrow"><span className="eyebrow__line" /> A JOURNEY WITH PURPOSE</p>
              <h2>See the subject<br />in a new light.</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="destination-intro__lede">{trip.introduction}</p>
              <div className="destination-intro__notice">
                <MapPin size={18} aria-hidden="true" />
                <span>Illustrative itinerary only. Venues, access, timings and bookings are not confirmed.</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section objectives-section">
          <div className="section-shell objectives-grid">
            <Reveal className="objectives-intro">
              <p className="eyebrow"><span className="eyebrow__line" /> LEARNING OBJECTIVES</p>
              <h2>Questions to<br />take with you.</h2>
              <p>Use these prompts to connect visits to classroom learning before, during and after the journey.</p>
            </Reveal>
            <div className="objective-list">
              {trip.objectives.map((objective, index) => (
                <Reveal key={objective} delay={index * 0.08}>
                  <div className="objective-item"><span>0{index + 1}</span><p>{objective}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section itinerary-section" id="itinerary">
          <div className="section-shell">
            <Reveal className="section-heading-row">
              <div>
                <p className="eyebrow"><span className="eyebrow__line" /> THE PROPOSED JOURNEY</p>
                <h2>Three days.<br />Many ways to learn.</h2>
              </div>
              <p className="section-heading-copy">A suggested outline to start a conversation. Every stop is subject to current venue access, group policies and school requirements.</p>
            </Reveal>
            <ItineraryTimeline days={trip.days} />
            <p className="itinerary-disclaimer">This itinerary is illustrative, not a confirmed booking. Verify venue access, dates, opening hours, school-group policies and travel arrangements before making plans.</p>
          </div>
        </section>

        <section className="section gallery-section">
          <div className="section-shell">
            <Reveal className="gallery-heading">
              <p className="eyebrow"><span className="eyebrow__line" /> A CLOSER LOOK</p>
              <h2>Places that open<br />up new perspectives.</h2>
            </Reveal>
            <div className="trip-gallery">
              {trip.gallery.map((image, index) => (
                <Reveal key={image.image} delay={index * 0.045} className={`trip-gallery__item trip-gallery__item--${index + 1}`}>
                  <figure>
                    <Image src={image.image} alt={image.alt} fill sizes="(max-width: 720px) 50vw, 25vw" />
                    <figcaption>{image.alt}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section outcomes-section">
          <div className="section-shell outcomes-grid">
            <Reveal>
              <p className="eyebrow"><span className="eyebrow__line" /> WHAT STUDENTS CAN TAKE AWAY</p>
              <h2>Learning that<br />travels home.</h2>
            </Reveal>
            <div className="outcome-list">
              {trip.learningOutcomes.map((outcome) => (
                <Reveal key={outcome}>
                  <div><Check size={17} aria-hidden="true" /><p>{outcome}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section planning-section">
          <div className="section-shell planning-card">
            <Reveal className="planning-card__title">
              <BookOpen size={20} aria-hidden="true" />
              <p className="eyebrow">FOR TEACHERS</p>
              <h2>Thoughtful planning<br />starts with the details.</h2>
              <p>Use these considerations as a starting point for a school-specific conversation.</p>
            </Reveal>
            <div className="planning-notes">
              {trip.planningNotes.map((note, index) => (
                <Reveal key={note} delay={index * 0.05}>
                  <div><span>0{index + 1}</span><p>{note}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="destination-register-cta">
          <div className="section-shell destination-register-cta__inner">
            <Reveal>
              <p className="eyebrow"><span className="eyebrow__line" /> START WITH AN ENQUIRY</p>
              <h2>Could this be<br />your next classroom?</h2>
              <p>Tell us a little about your school and the students you have in mind.</p>
              <Link className="button button--red" href={`/register?trip=${trip.slug}`}>
                Register school interest <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <small>No reservation is made by submitting an enquiry.</small>
            </Reveal>
            <div className="destination-register-cta__related">
              <span>KEEP EXPLORING</span>
              {related.map((destination) => (
                <Link key={destination.slug} href={`/trips/${destination.slug}`}>
                  <span>{destination.city}<small>{destination.theme}</small></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
