import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Beyond the Classroom | Learning Has No Borders",
    template: "%s | Beyond the Classroom",
  },
  description:
    "Curated educational journeys that bring learning to life through innovation, culture and global discovery.",
  applicationName: "Beyond the Classroom",
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0d0e",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
