import Link from "next/link"
import { Send } from "lucide-react"

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`brand-mark ${className}`} aria-label="Beyond the Classroom home">
      <span className="brand-mark__icon" aria-hidden="true">
        <Send size={18} strokeWidth={2.4} />
      </span>
      <span className="brand-mark__word">
        <span>BEYOND THE</span>
        <strong>CLASSROOM</strong>
      </span>
    </Link>
  )
}
