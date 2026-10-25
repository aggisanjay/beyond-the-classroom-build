import { z } from "zod"
import { TRIP_SLUGS } from "@/lib/trips/data"

export const tripInterestSchema = z.object({
  teacherName: z.string().trim().min(2, "Enter your name.").max(120, "Name must be 120 characters or fewer."),
  schoolName: z.string().trim().min(2, "Enter your school name.").max(160, "School name must be 160 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(254, "Email must be 254 characters or fewer.")
    .refine((value) => z.email().safeParse(value).success, "Enter a valid email address.")
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number with at least 7 digits.")
    .max(24, "Phone number must be 24 characters or fewer.")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "")
        return /^[+0-9(). -]+$/.test(value) && digits.length >= 7 && digits.length <= 15
      },
      "Use an international phone number with 7–15 digits."
    ),
  tripSlug: z.enum(TRIP_SLUGS),
  studentCount: z.coerce
    .number({ error: "Enter a student count." })
    .int("Student count must be a whole number.")
    .min(1, "At least one student is required.")
    .max(1000, "Student count cannot exceed 1,000."),
})

export type TripInterestFormInput = z.input<typeof tripInterestSchema>
export type TripInterestValues = z.output<typeof tripInterestSchema>
