"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, CircleNotch } from "@phosphor-icons/react"

import { formatCents } from "@/lib/booking/pricing"
import { BASE_DURATION_MIN, TIMEZONE } from "@/lib/booking/config"
import { SlotPicker } from "@/app/book/components/slot-picker"
import { createManualBooking } from "../actions"
import { Panel } from "../ui"

interface Band {
  id: string
  label_en: string
  base_cents: number
  deep_cents: number
}

/**
 * The same four questions as the public flow, on one screen — Jackie already
 * has the customer on the phone, so there is nothing to be gained by pacing
 * her through steps.
 *
 * Pricing shown here is only a preview. The server recalculates it from the
 * catalogue before saving, exactly as it does for an online booking.
 */
export function ManualBookingForm({
  bands,
  washPriceCents,
  washDurationMin,
}: {
  bands: Band[]
  washPriceCents: number
  washDurationMin: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [bandId, setBandId] = useState<string>("")
  const [deep, setDeep] = useState(false)
  const [wash, setWash] = useState(false)
  const [startsAt, setStartsAt] = useState<string | null>(null)
  const [f, setF] = useState({
    name: "", phone: "", email: "", street: "", postcode: "", city: "Lelystad", notes: "",
  })

  const band = bands.find((b) => b.id === bandId) ?? null
  const total = band ? band.base_cents + (deep ? band.deep_cents : 0) + (wash ? washPriceCents : 0) : 0
  const duration = BASE_DURATION_MIN + (deep ? 60 : 0) + (wash ? washDurationMin : 0)

  const ready = Boolean(band && startsAt && f.name.trim() && f.street.trim() && f.phone.trim())

  const submit = () =>
    startTransition(async () => {
      setError(null)
      const r = await createManualBooking({
        ...f,
        bandId,
        deepCleaning: deep,
        washingUp: wash,
        startsAtISO: startsAt!,
      })
      if (r.ok) router.push("/residents")
      else setError(r.error)
    })

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  return (
    <div className="space-y-4">
      <Panel className="p-4 sm:p-5">
        <h2 className="font-semibold text-gray-900">Customer</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Name" required value={f.name} onChange={set("name")} className="sm:col-span-2" />
          <Field label="Phone" required value={f.phone} onChange={set("phone")} type="tel" />
          <Field label="Email (optional)" value={f.email} onChange={set("email")} type="email" />
          <Field label="Street and number" required value={f.street} onChange={set("street")} className="sm:col-span-2" />
          <Field label="Postcode" value={f.postcode} onChange={set("postcode")} />
          <Field label="City" value={f.city} onChange={set("city")} />
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes" rows={2} value={f.notes} onChange={set("notes")}
              placeholder="Access, parking, pets…"
              className="mt-1.5 w-full border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-wj-dark"
            />
          </div>
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h2 className="font-semibold text-gray-900">Job</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {bands.map((b) => {
            const on = bandId === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBandId(b.id)}
                aria-pressed={on}
                className={`border p-3 text-left transition-colors ${
                  on ? "border-wj-dark bg-wj-dark/[0.06]" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="block text-sm text-gray-600">{b.label_en}</span>
                <span className="mt-0.5 block text-lg font-semibold text-gray-900 tabular-nums">
                  {formatCents(b.base_cents, "nl")}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Toggle on={deep} onClick={() => setDeep((v) => !v)} disabled={!band}>
            Deep clean {band ? `+ ${formatCents(band.deep_cents, "nl")}` : ""}
          </Toggle>
          <Toggle on={wash} onClick={() => setWash((v) => !v)}>
            Washing up + {formatCents(washPriceCents, "nl")}
          </Toggle>
        </div>

        {band && (
          <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
            {Math.floor(duration / 60)}h {duration % 60 ? `${duration % 60}m` : ""} ·{" "}
            <span className="font-semibold text-gray-900">{formatCents(total, "nl")}</span>
          </p>
        )}
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h2 className="mb-4 font-semibold text-gray-900">
          When <span className="font-normal text-gray-500">({TIMEZONE.replace("_", " ")})</span>
        </h2>
        {band ? (
          <SlotPicker
            deepCleaning={deep}
            washingUp={wash}
            value={startsAt}
            onSelect={(iso) => setStartsAt(iso)}
          />
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">Choose a size first.</p>
        )}
      </Panel>

      {error && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push("/residents")}
          className="inline-flex h-11 items-center justify-center border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!ready || pending}
          onClick={submit}
          className="inline-flex h-11 min-w-[10rem] items-center justify-center gap-1.5 bg-wj-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {pending ? <CircleNotch className="h-5 w-5 animate-spin" /> : <><CheckCircle weight="fill" className="h-4 w-4" /> Save booking</>}
        </button>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, type = "text", required, className = "",
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  className?: string
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-")
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-gray-400" aria-hidden>*</span>}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        className="mt-1.5 h-11 w-full border border-gray-300 bg-white px-3 text-sm outline-none transition-colors focus:border-wj-dark"
      />
    </div>
  )
}

function Toggle({
  on, onClick, disabled, children,
}: {
  on: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={`inline-flex h-11 items-center border px-4 text-sm font-medium transition-colors disabled:opacity-40 ${
        on ? "border-wj-dark bg-wj-dark text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  )
}
