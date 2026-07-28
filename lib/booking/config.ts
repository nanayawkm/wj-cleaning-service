/**
 * Booking rules that are policy, not data.
 *
 * Anything Jackie should change herself lives in the database — prices, which
 * days she works, which slots are open. What stays here is the handful of
 * rules that change how the system behaves rather than what it contains.
 */

/** Slot times are wall-clock in this zone; everything is stored as UTC. */
export const TIMEZONE = "Europe/Amsterdam"

/** A standard general clean, before any add-ons. */
export const BASE_DURATION_MIN = 180

/**
 * Gap after each job so back-to-back bookings are actually reachable. Counted
 * inside the booked interval, so it also stops a customer taking a slot that
 * begins the moment the previous one ends.
 */
export const TRAVEL_BUFFER_MIN = 30

/**
 * How far ahead a customer must book. Stops someone taking a 09:00 slot at
 * 08:40, and keeps the 24-hour reminder meaningful.
 */
export const MIN_NOTICE_HOURS = 24

/** How far forward the calendar offers. */
export const BOOKING_WINDOW_DAYS = 60

/** Statuses that occupy a slot. Cancelled bookings release their time. */
export const BLOCKING_STATUSES = ["confirmed", "rescheduled"] as const

export type BookingStatus =
  | "confirmed"
  | "rescheduled"
  | "completed"
  | "cancelled"
  | "no_show"
