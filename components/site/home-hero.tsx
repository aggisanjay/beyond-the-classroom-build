"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { destinations } from "@/lib/trips/data"

export function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const activeTrip = destinations[activeIndex]

  useEffect(() => {
    if (paused || reduceMotion) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % destinations.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion])

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + destinations.length) % destinations.length)
  }
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % destinations.length)
  }

  return (
    <section
      className="home-hero"
      id="home-hero"
      aria-roledescription="carousel"
      aria-label="Featured school trip destinations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious()
        if (event.key === "ArrowRight") showNext()
      }}
      onTouchStart={(event) => {
        touchStart.current = event.changedTouches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const finish = event.changedTouches[0]?.clientX
        touchStart.current = null
        if (start === null || finish === undefined) return
        if (finish - start > 55) showPrevious()
        if (start - finish > 55) showNext()
      }}
    >
      <div className="home-hero__background" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeTrip.slug}
            className="home-hero__image"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease: "easeInOut" }}
          >
            <Image
              src={activeTrip.heroImage}
              alt=""
              fill
              priority={activeIndex === 0}
              sizes="100vw"
              className="hero-image"
            />
          </motion.div>
        </AnimatePresence>
        <div className="home-hero__shade" />
        <div className="home-hero__grain" />
      </div>

      <div className="home-hero__content">
        <div className="home-hero__copy">
          <motion.p
            className="eyebrow home-hero__eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            <span className="eyebrow__line" /> CURATED SCHOOL JOURNEYS · 2026
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            Learning has
            <br />
            no borders<span>.</span>
          </motion.h1>
          <motion.p
            className="home-hero__description"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.32 }}
          >
            Curated educational journeys that bring learning to life through innovation, culture, and global discovery.
          </motion.p>
          <div className="home-hero__actions">
            <Link className="button button--red" href="/#destinations">
              Explore school trips <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button button--glass" href="/register">
              Plan your school journey <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTrip.slug}
              className="hero-featured-label"
              aria-live="polite"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
            >
              <span>NOW DISCOVERING</span>
              <strong>{activeTrip.city}</strong>
              <small>{activeTrip.theme}</small>
            </motion.div>
          </AnimatePresence>

          <div className="hero-carousel-controls" aria-label="Destination carousel controls">
            <button type="button" className="icon-button hero-arrow" aria-label="Previous destination" onClick={showPrevious}>
              <ArrowLeft size={17} />
            </button>
            <div className="hero-pagination" aria-label="Choose a destination slide">
              {destinations.map((trip, index) => (
                <button
                  key={trip.slug}
                  type="button"
                  className={`hero-dot${activeIndex === index ? " is-active" : ""}`}
                  aria-label={`Show ${trip.city} slide`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <button type="button" className="icon-button hero-arrow" aria-label="Next destination" onClick={showNext}>
              <ArrowRight size={17} />
            </button>
            <span className="hero-slide-count">0{activeIndex + 1}<i />0{destinations.length}</span>
          </div>
        </div>

        <div className="home-hero__destinations" aria-label="Choose a featured destination">
          <div className="hero-destination-heading">
            <span>FIELD NOTES / 0{activeIndex + 1}</span>
            <span>SELECT A JOURNEY</span>
          </div>
          {destinations.map((trip, index) => (
            <button
              type="button"
              key={trip.slug}
              className={`hero-destination${activeIndex === index ? " hero-destination--active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${trip.city}: ${trip.theme}`}
              aria-pressed={activeIndex === index}
            >
              <span className="hero-destination__image">
                <Image src={trip.cardImage} alt="" fill sizes="(max-width: 768px) 30vw, 250px" />
              </span>
              <span className="hero-destination__meta">
                <small>0{index + 1} / {trip.city.toUpperCase()}</small>
                <strong>{trip.theme}</strong>
                <span>Proposed 3-day journey</span>
              </span>
              <ArrowUpRight size={17} aria-hidden="true" className="hero-destination__arrow" />
            </button>
          ))}
          <Link className="hero-all-trips" href={`/trips/${activeTrip.slug}`}>
            Explore {activeTrip.city} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <a className="hero-scroll-cue" href="#destinations" aria-label="Scroll to featured destinations">
        <span>SCROLL TO DISCOVER</span>
        <ArrowDown size={14} aria-hidden="true" />
      </a>
    </section>
  )
}
