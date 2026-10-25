import Image from "next/image"
import { Reveal } from "@/components/site/motion-reveal"
import type { TripDay } from "@/lib/trips/data"

export function ItineraryTimeline({ days }: { days: TripDay[] }) {
  let stopNumber = 0

  return (
    <div className="itinerary-days">
      {days.map((day) => (
        <section className="itinerary-day" key={day.day} aria-labelledby={`day-${day.day}-title`}>
          <Reveal className="itinerary-day__heading">
            <span className="itinerary-day__number">DAY 0{day.day}</span>
            <div>
              <h3 id={`day-${day.day}-title`}>{day.title}</h3>
              <p>{day.focus}</p>
            </div>
          </Reveal>
          <div className="itinerary-stops">
            {day.stops.map((stop) => {
              stopNumber += 1
              return (
                <Reveal key={`${day.day}-${stop.title}`} delay={(stopNumber % 3) * 0.06}>
                  <article className="itinerary-stop">
                    <div className="itinerary-stop__image">
                      <Image
                        src={stop.image}
                        alt={stop.imageAlt}
                        fill
                        sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                      <span className="itinerary-stop__index">0{stopNumber}</span>
                    </div>
                    <div className="itinerary-stop__body">
                      <span className="itinerary-stop__focus">{stop.focus}</span>
                      <h4>{stop.title}</h4>
                      <p>{stop.description}</p>
                      {stop.accessNote && <span className="itinerary-stop__note">{stop.accessNote}</span>}
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
