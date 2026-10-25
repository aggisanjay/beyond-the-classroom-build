import { mkdir } from "node:fs/promises"
import sharp from "sharp"

const destinations = [
  {
    city: "singapore",
    sheet: "public/images/trips/singapore-contact-sheet.png",
    hero: "public/images/trips/singapore-hero.png",
    assets: [
      "science-centre",
      "gardens-by-the-bay",
      "artscience-museum",
      "nus-campus",
      "singapore-discovery-centre",
      "jewel-changi",
    ],
  },
  {
    city: "jaipur",
    sheet: "public/images/trips/jaipur-contact-sheet.png",
    hero: "public/images/trips/jaipur-hero.png",
    assets: [
      "city-palace",
      "jantar-mantar",
      "amber-fort",
      "panna-meena-stepwell",
      "block-printing",
      "albert-hall",
    ],
  },
  {
    city: "london",
    sheet: "public/images/trips/london-contact-sheet.png",
    hero: "public/images/trips/london-hero.png",
    assets: [
      "british-museum",
      "south-kensington",
      "imperial-college",
      "ucl-campus",
      "kings-college",
      "science-museum",
    ],
  },
]

for (const destination of destinations) {
  const outputDirectory = `public/images/trips/${destination.city}`
  await mkdir(outputDirectory, { recursive: true })

  const { width = 0, height = 0 } = await sharp(destination.sheet).metadata()
  if (!width || !height) throw new Error(`Could not read image dimensions for ${destination.city}`)

  const columns = 2
  const rows = 3
  for (let index = 0; index < destination.assets.length; index += 1) {
    const column = index % columns
    const row = Math.floor(index / columns)
    const left = Math.floor((column * width) / columns)
    const right = Math.floor(((column + 1) * width) / columns)
    const top = Math.floor((row * height) / rows)
    const bottom = Math.floor(((row + 1) * height) / rows)

    await sharp(destination.sheet)
      .extract({ left, top, width: right - left, height: bottom - top })
      .webp({ quality: 84, effort: 6 })
      .toFile(`${outputDirectory}/${destination.assets[index]}.webp`)
  }

  await sharp(destination.hero)
    .webp({ quality: 86, effort: 6 })
    .toFile(`${outputDirectory}/hero.webp`)
}

await sharp("public/images/japan-learning-story.png")
  .webp({ quality: 85, effort: 6 })
  .toFile("public/images/japan-learning-story.webp")

console.log("Processed 21 optimized local destination and story images.")
