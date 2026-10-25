"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  duration?: number
  scale?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 0.65,
  scale = 1,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  const offsets = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    none: { x: 0, y: 0 },
  }

  const start = offsets[direction] ?? offsets.up

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              scale: scale !== 1 ? scale : 1,
              ...start,
            }
      }
      whileInView={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        ease: [0.21, 1, 0.36, 1],
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  )
}
