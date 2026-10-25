export const TRIP_SLUGS = [
  "singapore-stem",
  "jaipur-heritage",
  "london-universities",
] as const

export type TripSlug = (typeof TRIP_SLUGS)[number]

export type TripStop = {
  title: string
  focus: string
  description: string
  image: string
  imageAlt: string
  accessNote?: string
}

export type TripDay = {
  day: number
  title: string
  focus: string
  stops: TripStop[]
}

export type TripDestination = {
  slug: TripSlug
  city: string
  shortName: string
  title: string
  theme: string
  heroImage: string
  heroAlt: string
  cardImage: string
  cardAlt: string
  summary: string
  introduction: string
  proposedDuration: string
  suggestedAgeRange: string
  learningOutcomes: string[]
  objectives: string[]
  planningNotes: string[]
  days: TripDay[]
  gallery: { image: string; alt: string }[]
}

export const destinations: TripDestination[] = [
  {
    slug: "singapore-stem",
    city: "Singapore",
    shortName: "Singapore",
    title: "Singapore STEM Expedition",
    theme: "STEM, sustainability & city systems",
    heroImage: "/images/trips/singapore/hero.webp",
    heroAlt: "Singapore's Marina Bay skyline at blue hour, with the ArtScience Museum by the water",
    cardImage: "/images/trips/singapore/gardens-by-the-bay.webp",
    cardAlt: "The Supertrees at Gardens by the Bay in Singapore at dusk",
    summary: "Explore how science, design and sustainability shape a city built for the future.",
    introduction:
      "Singapore offers a living classroom for curious minds. From interactive science exhibits to urban greenery and airport engineering, this proposed journey connects classroom concepts with the systems students encounter every day.",
    proposedDuration: "3 days · proposed itinerary",
    suggestedAgeRange: "13–18 years · suggested range",
    learningOutcomes: [
      "Connect scientific principles to hands-on exhibits and everyday systems.",
      "Investigate how urban ecology and infrastructure can work together.",
      "Compare design choices in public spaces, transport and the built environment.",
      "Practice observation, evidence gathering and collaborative reflection.",
    ],
    objectives: [
      "Use questions and observations to investigate engineering and scientific ideas.",
      "Consider how a dense city plans for green space, water and energy.",
      "Explore pathways from school subjects to university-level study.",
    ],
    planningNotes: [
      "All venues and campus areas are suggested only; access, opening hours and group policies must be confirmed directly before planning.",
      "Build in time for heat, humidity, hydration and indoor rest stops.",
      "Confirm transport, dietary needs, supervision ratios, accessibility and safeguarding arrangements for the school group.",
    ],
    days: [
      {
        day: 1,
        title: "Science in the city",
        focus: "From hands-on discovery to urban sustainability",
        stops: [
          {
            title: "Science Centre Singapore",
            focus: "Experiments & discovery",
            description:
              "Use demonstrations and interactive exhibits to turn questions about physics, biology and engineering into observations students can discuss.",
            image: "/images/trips/singapore/science-centre.webp",
            imageAlt: "Science Centre Singapore and its interactive learning spaces",
          },
          {
            title: "Gardens by the Bay",
            focus: "Urban ecology",
            description:
              "Look at the relationship between planting, climate, energy and public space through the lens of a carefully designed urban garden.",
            image: "/images/trips/singapore/gardens-by-the-bay.webp",
            imageAlt: "The Supertrees at Gardens by the Bay in Singapore",
          },
          {
            title: "Marina Bay waterfront",
            focus: "Infrastructure & planning",
            description:
              "Observe the waterfront as a connected system and discuss how land use, movement and public access influence a growing city.",
            image: "/images/trips/singapore/hero.webp",
            imageAlt: "Singapore's Marina Bay skyline and waterfront at blue hour",
          },
        ],
      },
      {
        day: 2,
        title: "Ideas in motion",
        focus: "Where creative practice and research meet",
        stops: [
          {
            title: "ArtScience Museum",
            focus: "Art, science & technology",
            description:
              "Use an exhibition visit as a prompt to consider how creative practice can communicate scientific ideas and new technologies.",
            image: "/images/trips/singapore/artscience-museum.webp",
            imageAlt: "The ArtScience Museum beside Marina Bay in Singapore",
          },
          {
            title: "National University of Singapore campus area",
            focus: "University discovery",
            description:
              "Introduce university study, research and subject pathways through a self-guided campus-area exploration, subject to visitor access.",
            image: "/images/trips/singapore/nus-campus.webp",
            imageAlt: "A green courtyard in the National University of Singapore campus area",
            accessNote: "Campus-area exploration only unless an official visit is confirmed.",
          },
          {
            title: "Singapore Discovery Centre",
            focus: "Future thinking",
            description:
              "Discuss how interactive learning environments can invite students to model possibilities, ask questions and compare perspectives.",
            image: "/images/trips/singapore/singapore-discovery-centre.webp",
            imageAlt: "An immersive learning installation at Singapore Discovery Centre",
            accessNote: "Suggested visit; verify current school-group availability and access.",
          },
        ],
      },
      {
        day: 3,
        title: "Engineering in everyday life",
        focus: "Design, movement and the visitor experience",
        stops: [
          {
            title: "Jewel Changi Airport",
            focus: "Architecture & ecosystems",
            description:
              "Observe how structure, circulation, planting and a large indoor waterfall combine in a public space designed around movement.",
            image: "/images/trips/singapore/jewel-changi.webp",
            imageAlt: "The indoor waterfall beneath Jewel Changi Airport's glass canopy",
          },
        ],
      },
    ],
    gallery: [
      { image: "/images/trips/singapore/science-centre.webp", alt: "Hands-on science learning at Science Centre Singapore" },
      { image: "/images/trips/singapore/gardens-by-the-bay.webp", alt: "Supertrees and planting at Gardens by the Bay" },
      { image: "/images/trips/singapore/artscience-museum.webp", alt: "The ArtScience Museum beside Marina Bay" },
      { image: "/images/trips/singapore/nus-campus.webp", alt: "A leafy university campus courtyard in Singapore" },
      { image: "/images/trips/singapore/singapore-discovery-centre.webp", alt: "An immersive exhibit at Singapore Discovery Centre" },
      { image: "/images/trips/singapore/jewel-changi.webp", alt: "Jewel Changi Airport's indoor waterfall and glass roof" },
    ],
  },
  {
    slug: "jaipur-heritage",
    city: "Jaipur",
    shortName: "Jaipur",
    title: "Jaipur Heritage Journey",
    theme: "Architecture, astronomy & living craft",
    heroImage: "/images/trips/jaipur/hero.webp",
    heroAlt: "The rose sandstone facade of Hawa Mahal in Jaipur at golden hour",
    cardImage: "/images/trips/jaipur/amber-fort.webp",
    cardAlt: "Amber Fort above Maota Lake in Jaipur at golden hour",
    summary: "Read a city's history through its architecture, astronomical instruments and craft traditions.",
    introduction:
      "Jaipur's built heritage makes history tangible. This proposed journey invites students to look closely at architecture, urban life, astronomical observation, water design and the skills carried through local craft traditions.",
    proposedDuration: "3 days · proposed itinerary",
    suggestedAgeRange: "13–18 years · suggested range",
    learningOutcomes: [
      "Interpret architectural details as evidence of changing social and urban life.",
      "Explore how historical instruments supported observation of the sky.",
      "Discuss water management through the form and function of a stepwell.",
      "Recognize craft as knowledge expressed through materials, pattern and practice.",
    ],
    objectives: [
      "Ask how design responds to climate, community and available materials.",
      "Connect historical astronomy to observation, measurement and mathematics.",
      "Approach heritage and craft with curiosity, care and respect for local context.",
    ],
    planningNotes: [
      "All visits and workshop participation are proposed; confirm access, local guidance, opening hours and school-group arrangements directly.",
      "Plan for warm weather, walking surfaces, shade, water and suitable footwear.",
      "Discuss respectful photography, local customs, accessibility and supervision expectations with the school before travel.",
    ],
    days: [
      {
        day: 1,
        title: "A city shaped by design",
        focus: "Architecture, collections and the science of the sky",
        stops: [
          {
            title: "Hawa Mahal",
            focus: "Architecture & urban life",
            description:
              "Study the facade, openings and relationship to the surrounding streets as an entry point into Jaipur's architectural history.",
            image: "/images/trips/jaipur/hero.webp",
            imageAlt: "Hawa Mahal's rose sandstone facade in Jaipur",
          },
          {
            title: "City Palace",
            focus: "History & collections",
            description:
              "Consider how objects, rooms and courtyards can be read as evidence of a changing court, city and cultural landscape.",
            image: "/images/trips/jaipur/city-palace.webp",
            imageAlt: "An ornate courtyard at Jaipur City Palace",
          },
          {
            title: "Jantar Mantar",
            focus: "Astronomy & measurement",
            description:
              "Explore monumental instruments as a way to discuss observation, geometry and the history of studying the sky.",
            image: "/images/trips/jaipur/jantar-mantar.webp",
            imageAlt: "Astronomical instruments at Jantar Mantar in Jaipur",
          },
        ],
      },
      {
        day: 2,
        title: "Engineering for place",
        focus: "Fortification, water and material knowledge",
        stops: [
          {
            title: "Amber Fort",
            focus: "Architecture & engineering",
            description:
              "Look at the fort's setting, built form and movement through space while placing its history in a broader, respectful context.",
            image: "/images/trips/jaipur/amber-fort.webp",
            imageAlt: "Amber Fort overlooking Maota Lake near Jaipur",
          },
          {
            title: "Panna Meena ka Kund",
            focus: "Stepwell design & water",
            description:
              "Use the stepwell's geometry and levels to prompt discussion about water access, structure and public space.",
            image: "/images/trips/jaipur/panna-meena-stepwell.webp",
            imageAlt: "Geometric stairways at Panna Meena ka Kund in Jaipur",
          },
          {
            title: "Local block-printing workshop",
            focus: "Craft & material culture",
            description:
              "If available, observe or take part in a locally guided block-printing session to learn how pattern, tools and practiced skill come together.",
            image: "/images/trips/jaipur/block-printing.webp",
            imageAlt: "An artisan demonstrating block printing on patterned fabric",
            accessNote: "Subject to local availability and workshop arrangements.",
          },
        ],
      },
      {
        day: 3,
        title: "Stories in collections",
        focus: "Art, history and cultural interpretation",
        stops: [
          {
            title: "Albert Hall Museum",
            focus: "Art & cultural collections",
            description:
              "Use selected objects and the museum's architecture to discuss how collections preserve, interpret and present cultural stories.",
            image: "/images/trips/jaipur/albert-hall.webp",
            imageAlt: "Albert Hall Museum's illuminated facade in Jaipur",
          },
        ],
      },
    ],
    gallery: [
      { image: "/images/trips/jaipur/city-palace.webp", alt: "Courtyard architecture at City Palace in Jaipur" },
      { image: "/images/trips/jaipur/jantar-mantar.webp", alt: "Astronomical instruments at Jantar Mantar" },
      { image: "/images/trips/jaipur/amber-fort.webp", alt: "Amber Fort above Maota Lake" },
      { image: "/images/trips/jaipur/panna-meena-stepwell.webp", alt: "The patterned steps of Panna Meena ka Kund" },
      { image: "/images/trips/jaipur/block-printing.webp", alt: "A block-printing demonstration in Jaipur" },
      { image: "/images/trips/jaipur/albert-hall.webp", alt: "Albert Hall Museum at dusk" },
    ],
  },
  {
    slug: "london-universities",
    city: "London",
    shortName: "London",
    title: "London University Discovery",
    theme: "Universities, museums & engineering",
    heroImage: "/images/trips/london/hero.webp",
    heroAlt: "Tower Bridge and the Thames in London at sunset",
    cardImage: "/images/trips/london/british-museum.webp",
    cardAlt: "The British Museum's glass-roofed Great Court in London",
    summary: "Connect museum collections, engineering and university-area exploration with future study.",
    introduction:
      "London brings collections, engineering landmarks and a wide range of academic settings into one proposed itinerary. Students can compare ways of learning while exploring university areas without assuming access to restricted buildings or official admissions sessions.",
    proposedDuration: "3 days · proposed itinerary",
    suggestedAgeRange: "14–18 years · suggested range",
    learningOutcomes: [
      "Use museum collections to compare evidence, interpretation and historical perspectives.",
      "Relate engineering landmarks to movement, infrastructure and the city around them.",
      "Reflect on university environments and possible academic pathways.",
      "Practice asking informed questions about study, research and future careers.",
    ],
    objectives: [
      "Compare how museums and universities organize knowledge for different audiences.",
      "Observe how engineering choices shape the way a city functions.",
      "Build confidence exploring higher-education environments respectfully.",
    ],
    planningNotes: [
      "University visits are campus-area explorations only unless an official visit is confirmed; no admissions session, meeting or building access is promised.",
      "Museum admission, group booking requirements, current exhibitions and opening hours must be checked before travel.",
      "Plan for walking, public transport, accessible routes, safeguarding, group meeting points and student supervision.",
    ],
    days: [
      {
        day: 1,
        title: "Collections and discovery",
        focus: "How objects, science and place tell stories",
        stops: [
          {
            title: "British Museum",
            focus: "History & archaeology",
            description:
              "Select objects for close observation and discuss how museums interpret history, archaeology and global cultural heritage.",
            image: "/images/trips/london/british-museum.webp",
            imageAlt: "The British Museum Great Court beneath its glass roof",
          },
          {
            title: "South Kensington museums area",
            focus: "Science & collections",
            description:
              "Explore the museum district as a setting for scientific collections and public learning, with a venue chosen to match the group's interests.",
            image: "/images/trips/london/south-kensington.webp",
            imageAlt: "The museum district around South Kensington in London",
          },
          {
            title: "Imperial College London campus area",
            focus: "STEM & research pathways",
            description:
              "Observe the campus area and discuss possible links between school subjects, scientific research and future study.",
            image: "/images/trips/london/imperial-college.webp",
            imageAlt: "A courtyard in the Imperial College London campus area",
            accessNote: "Campus-area exploration only unless an official visit is confirmed.",
          },
        ],
      },
      {
        day: 2,
        title: "University life and ideas",
        focus: "Academic pathways, research and technology",
        stops: [
          {
            title: "University College London campus area",
            focus: "Higher education",
            description:
              "Use a self-guided area walk to notice how a university fits into the city and to discuss questions students may have about further study.",
            image: "/images/trips/london/ucl-campus.webp",
            imageAlt: "A courtyard in the University College London campus area",
            accessNote: "Campus-area exploration only unless an official visit is confirmed.",
          },
          {
            title: "King's College London campus area",
            focus: "Subject exploration",
            description:
              "Compare the surrounding academic environment and invite students to reflect on subjects they might want to explore further.",
            image: "/images/trips/london/kings-college.webp",
            imageAlt: "A historic courtyard in the King's College London campus area",
            accessNote: "Campus-area exploration only unless an official visit is confirmed.",
          },
          {
            title: "Science Museum",
            focus: "Engineering & technology",
            description:
              "Use objects and exhibits to trace how ideas in science, engineering and technology have shaped everyday life.",
            image: "/images/trips/london/science-museum.webp",
            imageAlt: "Engineering and science displays at the Science Museum in London",
          },
        ],
      },
      {
        day: 3,
        title: "The city as an engineering brief",
        focus: "Infrastructure, movement and urban history",
        stops: [
          {
            title: "Tower Bridge and the Thames",
            focus: "Engineering & infrastructure",
            description:
              "Observe the bridge and riverside as connected infrastructure, then discuss how engineering responds to movement, scale and the city.",
            image: "/images/trips/london/hero.webp",
            imageAlt: "Tower Bridge spanning the Thames in London at sunset",
          },
        ],
      },
    ],
    gallery: [
      { image: "/images/trips/london/british-museum.webp", alt: "The British Museum's Great Court" },
      { image: "/images/trips/london/south-kensington.webp", alt: "South Kensington's museum district" },
      { image: "/images/trips/london/imperial-college.webp", alt: "A courtyard in the Imperial College London campus area" },
      { image: "/images/trips/london/ucl-campus.webp", alt: "A courtyard in the UCL campus area" },
      { image: "/images/trips/london/kings-college.webp", alt: "A courtyard in the King's College London campus area" },
      { image: "/images/trips/london/science-museum.webp", alt: "Science and engineering displays in the Science Museum" },
    ],
  },
]

export function getTripBySlug(slug: string): TripDestination | undefined {
  return destinations.find((trip) => trip.slug === slug)
}

export function isTripSlug(value: string): value is TripSlug {
  return (TRIP_SLUGS as readonly string[]).includes(value)
}

export function getTripName(slug: string): string {
  return getTripBySlug(slug)?.title ?? "Unknown trip"
}
