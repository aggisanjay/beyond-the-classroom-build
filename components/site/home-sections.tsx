import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  GraduationCap,
  Globe2,
  Lightbulb,
  ShieldCheck,
  UsersRound,
} from "lucide-react"
import { Reveal } from "@/components/site/motion-reveal"
import { destinations } from "@/lib/trips/data"

const values = [
  { icon: Compass, title: "Curated educational itineraries" },
  { icon: Lightbulb, title: "Real-world learning" },
  { icon: ShieldCheck, title: "Teacher-led planning" },
  { icon: Globe2, title: "Global perspectives" },
  { icon: UsersRound, title: "Student-first experiences" },
]

export function TrustStrip() {
  return (
    <section className="value-strip" aria-label="Our approach">
      <div className="value-strip__inner">
        {values.map(({ icon: Icon, title }, index) => (
          <Reveal key={title} delay={index * 0.06}>
            <div className="value-strip__item">
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>{title}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function FeaturedDestinations() {
  return (
    <section className="section destinations-section" id="destinations">
      <div className="section-shell">
        <Reveal className="section-heading-row">
          <div>
            <p className="eyebrow"><span className="eyebrow__line" /> POPULAR DESTINATIONS</p>
            <h2>Field trips.<br className="desktop-break" /> Real-world discovery.</h2>
          </div>
          <p className="section-heading-copy">
            Three thoughtfully imagined journeys, each built around a different way of seeing the world.
          </p>
        </Reveal>

        <div className="destination-card-grid">
          {destinations.map((trip, index) => (
            <Reveal key={trip.slug} delay={index * 0.1}>
              <Link href={`/trips/${trip.slug}`} className="destination-card">
                <div className="destination-card__image">
                  <Image
                    src={trip.cardImage}
                    alt={trip.cardAlt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                  <span className="destination-card__number">0{index + 1}</span>
                  <span className="destination-card__duration">Proposed · 3 days</span>
                </div>
                <div className="destination-card__body">
                  <span className="destination-card__theme">{trip.theme}</span>
                  <div className="destination-card__title-row">
                    <h3>{trip.city}</h3>
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </div>
                  <p>{trip.summary}</p>
                  <span className="destination-card__link">Explore journey <ArrowRight size={15} aria-hidden="true" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="section-footnote">All itineraries are illustrative proposals, not confirmed bookings.</p>
      </div>
    </section>
  )
}

export function LearningStory() {
  return (
    <section className="section story-section" id="about">
      <div className="section-shell story-section__grid">
        <Reveal direction="left" className="story-section__image-wrap">
          <div className="story-image-frame">
            <Image
              src="/images/japan-learning-story.webp"
              alt="A quiet Japanese temple gate framed by cherry blossoms and a mountain landscape"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
            <span className="story-image-caption">A different kind of classroom</span>
          </div>
          <span className="story-index">01 / OUTSIDE THE ORDINARY</span>
        </Reveal>
        <Reveal direction="right" className="story-section__copy">
          <p className="eyebrow"><span className="eyebrow__line" /> LEARNING BEYOND TEXTBOOKS</p>
          <h2>Some lessons<br />need a wider view.</h2>
          <p className="story-lede">
            A city can turn a diagram into a system you can walk through. A museum can make history feel close enough to question.
          </p>
          <p>
            Educational travel gives students a shared place to observe, compare and reflect—connecting STEM, culture, university discovery and everyday life to what they are already learning.
          </p>
          <div className="story-topic-list">
            <span><BookOpen size={16} /> History & culture</span>
            <span><Lightbulb size={16} /> Practical STEM</span>
            <span><GraduationCap size={16} /> University & careers</span>
          </div>
          <Link className="text-link" href="/#why-us">Why learning travels <ArrowRight size={16} /></Link>
        </Reveal>
      </div>
    </section>
  )
}

const processSteps = [
  { number: "01", title: "Discover a destination", copy: "Explore a proposed itinerary and choose the learning themes that fit your students." },
  { number: "02", title: "Register your school's interest", copy: "Share a few details so the enquiry can be reviewed by the trip team." },
  { number: "03", title: "Discuss your next steps", copy: "Talk through group needs, timing and a possible itinerary before making any plans." },
]

export function HowItWorks() {
  return (
    <section className="section process-section" id="how-it-works">
      <div className="section-shell">
        <Reveal className="section-heading-row">
          <div>
            <p className="eyebrow"><span className="eyebrow__line" /> A CLEAR PLACE TO START</p>
            <h2>From first idea<br />to a thoughtful plan.</h2>
          </div>
          <p className="section-heading-copy">A simple conversation, shaped around your school and the way your students learn.</p>
        </Reveal>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.1}>
              <article className="process-step">
                <span className="process-step__number">{step.number}</span>
                <span className="process-step__connector" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="section-footnote">Submitting interest is an enquiry only; it does not confirm a place or reservation.</p>
      </div>
    </section>
  )
}

const reasons = [
  { icon: BookOpen, title: "Structured learning", copy: "Itineraries start with clear learning themes and room for reflection." },
  { icon: ShieldCheck, title: "Teacher-first planning", copy: "Group needs, supervision and practical questions belong in the conversation." },
  { icon: UsersRound, title: "Age-aware experiences", copy: "Activities can be considered in context of student age, interests and access needs." },
  { icon: Globe2, title: "Cultural perspective", copy: "Make space for local context, respectful questions and more than one point of view." },
  { icon: Compass, title: "Flexible proposals", copy: "Discuss timing, group size and itinerary priorities before any commitment." },
  { icon: GraduationCap, title: "Academic connections", copy: "Link place-based learning to subjects, future study and possible careers." },
]

export function WhySchoolsChooseUs() {
  return (
    <section className="section why-section" id="why-us">
      <div className="section-shell">
        <Reveal className="section-heading-row">
          <div>
            <p className="eyebrow"><span className="eyebrow__line" /> THOUGHTFUL BY DESIGN</p>
            <h2>Made for the way<br />schools really plan.</h2>
          </div>
          <p className="section-heading-copy">A strong trip starts with learning goals and honest conversations about what is possible.</p>
        </Reveal>
        <div className="reason-grid">
          {reasons.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.045}>
              <article className="reason-card">
                <span className="reason-card__icon"><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TeacherCta() {
  return (
    <section className="teacher-cta" id="school-trips">
      <div className="teacher-cta__image" aria-hidden="true">
        <Image src="/images/trips/jaipur/hero.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="teacher-cta__overlay" />
      <Reveal className="teacher-cta__content">
        <p className="eyebrow"><span className="eyebrow__line" /> FOR TEACHERS & SCHOOLS</p>
        <h2>Your students&apos; next<br />great lesson starts here.</h2>
        <p>Tell us about your school and the journey you have in mind.</p>
        <Link className="button button--red" href="/register">
          Register school interest <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <span className="teacher-cta__note">An enquiry is the beginning of a conversation, not a confirmed reservation.</span>
      </Reveal>
    </section>
  )
}
