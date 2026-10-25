"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react"
import { TRIP_SLUGS, destinations, type TripSlug } from "@/lib/trips/data"
import { tripInterestSchema, type TripInterestFormInput, type TripInterestValues } from "@/lib/validation/trip-interest"

type RegistrationFormProps = { initialTrip?: TripSlug }

type FormState = { type: "success" | "error"; message: string } | null

export function RegistrationForm({ initialTrip }: RegistrationFormProps) {
  const [formState, setFormState] = useState<FormState>(null)
  const [website, setWebsite] = useState("")
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TripInterestFormInput, unknown, TripInterestValues>({
    resolver: zodResolver(tripInterestSchema),
    defaultValues: {
      teacherName: "",
      schoolName: "",
      email: "",
      phone: "",
      tripSlug: initialTrip ?? TRIP_SLUGS[0],
      studentCount: 24,
    },
  })

  async function submitEnquiry(values: TripInterestValues) {
    setFormState(null)
    try {
      const response = await fetch("/api/trip-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      })
      const result = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        throw new Error(result?.message ?? "We could not submit your enquiry. Please try again.")
      }

      setFormState({
        type: "success",
        message: "Your school interest has been received. This is an enquiry only; no trip or place is confirmed.",
      })
      setWebsite("")
      reset({
        teacherName: "",
        schoolName: "",
        email: "",
        phone: "",
        tripSlug: initialTrip ?? TRIP_SLUGS[0],
        studentCount: 24,
      })
    } catch (error) {
      setFormState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not submit your enquiry. Please try again.",
      })
    }
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit(submitEnquiry)} noValidate>
      <div className="registration-form__topline">
        <span>YOUR SCHOOL ENQUIRY</span>
        <span>01 — 06</span>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="teacher-name">Teacher name <span aria-hidden="true">*</span></label>
          <input id="teacher-name" autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.teacherName} aria-describedby={errors.teacherName ? "teacher-name-error" : undefined} {...register("teacherName")} />
          {errors.teacherName && <p className="field-error" id="teacher-name-error">{errors.teacherName.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="school-name">School name <span aria-hidden="true">*</span></label>
          <input id="school-name" autoComplete="organization" placeholder="School or institution" aria-invalid={!!errors.schoolName} aria-describedby={errors.schoolName ? "school-name-error" : undefined} {...register("schoolName")} />
          {errors.schoolName && <p className="field-error" id="school-name-error">{errors.schoolName.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="teacher-email">Email address <span aria-hidden="true">*</span></label>
          <input id="teacher-email" type="email" autoComplete="email" placeholder="you@school.org" aria-invalid={!!errors.email} aria-describedby={errors.email ? "teacher-email-error" : undefined} {...register("email")} />
          {errors.email && <p className="field-error" id="teacher-email-error">{errors.email.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="teacher-phone">Phone number <span aria-hidden="true">*</span></label>
          <input id="teacher-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 555 010 2040" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "teacher-phone-error" : "teacher-phone-hint"} {...register("phone")} />
          {errors.phone ? <p className="field-error" id="teacher-phone-error">{errors.phone.message}</p> : <p className="field-hint" id="teacher-phone-hint">International formats are welcome.</p>}
        </div>
        <div className="form-field form-field--wide">
          <label htmlFor="trip-slug">Trip of interest <span aria-hidden="true">*</span></label>
          <select id="trip-slug" aria-invalid={!!errors.tripSlug} aria-describedby={errors.tripSlug ? "trip-slug-error" : undefined} {...register("tripSlug")}>
            {destinations.map((trip) => <option key={trip.slug} value={trip.slug}>{trip.title}</option>)}
          </select>
          {errors.tripSlug && <p className="field-error" id="trip-slug-error">Choose one of the available trips.</p>}
        </div>
        <div className="form-field form-field--wide">
          <label htmlFor="student-count">Approximate number of students <span aria-hidden="true">*</span></label>
          <input id="student-count" type="number" inputMode="numeric" min={1} max={1000} step={1} aria-invalid={!!errors.studentCount} aria-describedby={errors.studentCount ? "student-count-error" : "student-count-hint"} {...register("studentCount", { valueAsNumber: true })} />
          {errors.studentCount ? <p className="field-error" id="student-count-error">{errors.studentCount.message}</p> : <p className="field-hint" id="student-count-hint">Enter a whole number between 1 and 1,000.</p>}
        </div>
      </div>

      <div className="registration-form__honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>

      {formState && (
        <div className={`form-status form-status--${formState.type}`} role={formState.type === "error" ? "alert" : "status"}>
          {formState.type === "success" && <CheckCircle2 size={18} aria-hidden="true" />}
          <p>{formState.message}</p>
        </div>
      )}

      <div className="registration-form__submit-row">
        <button type="submit" className="button button--red" disabled={isSubmitting}>
          {isSubmitting ? <><LoaderCircle size={16} className="spin" aria-hidden="true" /> Sending enquiry…</> : <>Send school interest <ArrowRight size={16} aria-hidden="true" /></>}
        </button>
        <p>By submitting, you agree that we may use these details to respond to this enquiry. See our <a href="/privacy">privacy notice</a>.</p>
      </div>
    </form>
  )
}
