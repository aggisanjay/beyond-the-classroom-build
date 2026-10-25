"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { destinations } from "@/lib/trips/data"

const destinationTaglines: Record<string, string> = {
  "singapore-stem": "Innovation Meets Learning",
  "jaipur-heritage": "Heritage Comes Alive",
  "london-universities": "Global Exposure for Brighter Futures",
}

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
      {/* Background Image Carousel with smooth crossfade */}
      <div className="home-hero__background" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeTrip.slug}
            className="home-hero__image"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
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
        <div className="home-hero__vignette" />
      </div>

      <div className="home-hero__content-shell">
        {/* Left Editorial Content */}
        <div className="home-hero__copy">
          <motion.div
            className="home-hero__tag"
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="hero-tag-bar" />
            <span>EDUCATE &nbsp; EXPLORE &nbsp; EXPERIENCE</span>
          </motion.div>

          <motion.h1
            className="home-hero__headline"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            LEARNING<br />HAS NO BORDERS
          </motion.h1>

          <motion.p
            className="home-hero__description"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Curated international school trips that bring learning to life through culture, innovation and real-world experiences.
          </motion.p>

          <motion.div
            className="home-hero__cta-row"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            <Link className="button button--red hero-primary-cta" href="/#destinations">
              EXPLORE SCHOOL TRIPS <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Top-Right Destination Badges & Carousel Controls */}
        <div className="home-hero__right-rail">
          <div className="hero-dest-tags-list">
            {destinations.map((trip, idx) => {
              const isCurrent = activeIndex === idx
              return (
                <button
                  key={trip.slug}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`hero-dest-pill-card${isCurrent ? " is-active" : ""}`}
                >
                  <span className={`dest-pill-bar${isCurrent ? " is-active" : ""}`} />
                  <div className="dest-pill-info">
                    <strong className="dest-pill-city">{trip.city.toUpperCase()}</strong>
                    <span className="dest-pill-theme">
                      {destinationTaglines[trip.slug] ?? trip.theme}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Carousel Arrows and Indicator Dots */}
          <div className="hero-carousel-nav">
            <div className="hero-dots-row">
              {destinations.map((trip, idx) => (
                <button
                  key={trip.slug}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`hero-slider-dot${activeIndex === idx ? " is-active" : ""}`}
                  aria-label={`Go to slide ${idx + 1}: ${trip.city}`}
                />
              ))}
            </div>
            <div className="hero-nav-arrows">
              <button
                type="button"
                onClick={showPrevious}
                className="hero-arrow-btn"
                aria-label="Previous destination"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="hero-arrow-btn"
                aria-label="Next destination"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
