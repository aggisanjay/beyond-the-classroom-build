import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DestinationExperience } from "@/components/trips/destination-experience"
import { destinations, getTripBySlug } from "@/lib/trips/data"

type DestinationPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return destinations.map((trip) => ({ slug: trip.slug }))
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params
  const trip = getTripBySlug(slug)
  if (!trip) return { title: "Destination not found" }
  return {
    title: trip.title,
    description: trip.summary,
    openGraph: {
      title: `${trip.title} | Beyond the Classroom`,
      description: trip.summary,
      images: [{ url: trip.heroImage, alt: trip.heroAlt }],
    },
  }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params
  const trip = getTripBySlug(slug)
  if (!trip) notFound()
  return <DestinationExperience trip={trip} />
}
