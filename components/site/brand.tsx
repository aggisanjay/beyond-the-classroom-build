import Link from "next/link"

export function BrandLogoIcon({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 4L25 13L14 15.5L3 4Z" fill="#F12B35" />
      <path d="M14 15.5L25 13L11 24V17.5L14 15.5Z" fill="#D31D27" />
      <path d="M3 4L14 15.5L11 17.5L3 4Z" fill="#FF4851" />
    </svg>
  )
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`brand-mark ${className}`} aria-label="Beyond the Classroom home">
      <BrandLogoIcon size={26} className="brand-mark__origami" />
      <span className="brand-mark__word">
        <span className="brand-mark__beyond">BEYOND</span>
        <strong className="brand-mark__classroom">THE CLASSROOM</strong>
      </span>
    </Link>
  )
}
