"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right"
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const offsets = { up: { x: 0, y: 20 }, left: { x: -22, y: 0 }, right: { x: 22, y: 0 } }
  const start = offsets[direction]

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, ...start }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}
