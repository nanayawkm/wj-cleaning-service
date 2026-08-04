"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  CaretDown,
  CircleNotch,
  Envelope,
  Phone,
  Trash,
  UserPlus,
  Warning,
} from "@phosphor-icons/react"

import { TIMEZONE } from "@/lib/booking/config"
import { Panel } from "../ui"
import {
  deleteApplication,
  purgeOverdueApplications,
  saveApplicationNotes,
  setApplicationStatus,
} from "./actions"
import {
  RETENTION_MONTHS,
  STATUSES,
  STATUS_STYLES,
  labelFor,
  type ApplicationRow,
  type ApplicationStatus,
} from "./shared"

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))

/** "2 days ago" beats a date for triage — the question is always how stale. */
function ago(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`
}

type Filter = "all" | ApplicationStatus

export function ApplicationList({
  rows,
  overdueCount,
}: {
  rows: ApplicationRow[]
  overdueCount: number
}) {
  const [filter, setFilter] = useState<Filter>("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length }
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1
    return c
  }, [rows])

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter)

  return (
    <>
      {overdueCount > 0 && <RetentionBanner count={overdueCount} />}

      {/* Filter strip. Scrolls rather than wraps, so it stays one line on a
          phone like the dashboard's own nav tabs. */}
      <div className="mb-4 flex gap-1 overflow-x-auto">
        {(["all", ...STATUSES] as Filter[]).map((f) => {
          const active = filter === f
          const n = counts[f] ?? 0
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`flex h-9 flex-shrink-0 items-center gap-1.5 whitespace-nowrap border px-3 text-sm font-medium capitalize transition-colors ${
                active
                  ? "border-wj-dark bg-wj-dark text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
              <span className={active ? "text-white/70" : "text-gray-400"}>{n}</span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <Panel className="p-12 text-center">
          <UserPlus className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">Nothing {filter}</p>
          <p className="mt-1 text-sm text-gray-500">Try another filter.</p>
        </Panel>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <ApplicationCard
              key={r.id}
              row={r}
              open={expanded === r.id}
              onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

/**
 * The retention promise, made visible.
 *
 * /careers tells applicants their details are kept for twelve months and then
 * deleted. Nothing enforces that on its own, so anything past the line is
 * surfaced here with the one button that keeps the promise.
 */
function RetentionBanner({ count }: { count: number }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const purge = () =>
    startTransition(async () => {
      await purgeOverdueApplications()
      setConfirming(false)
      router.refresh()
    })

  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border border-amber-300 bg-amber-50 p-4">
      <div className="flex gap-3">
        <Warning weight="fill" className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-900">
            {count} application{count === 1 ? " is" : "s are"} over {RETENTION_MONTHS} months old
          </p>
          <p className="mt-0.5 text-sm text-amber-800">
            The careers page promises these are deleted. {confirming && "This cannot be undone."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => (confirming ? purge() : setConfirming(true))}
        disabled={pending}
        className={`inline-flex h-10 flex-shrink-0 items-center gap-1.5 px-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
          confirming ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
        }`}
      >
        {pending ? (
          <CircleNotch className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        )}
        {confirming ? `Yes, delete ${count}` : `Delete ${count}`}
      </button>
    </div>
  )
}

function ApplicationCard({
  row,
  open,
  onToggle,
}: {
  row: ApplicationRow
  open: boolean
  onToggle: () => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [notes, setNotes] = useState(row.notes ?? "")
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const move = (status: ApplicationStatus) =>
    startTransition(async () => {
      await setApplicationStatus(row.id, status)
      router.refresh()
    })

  const saveNotes = () =>
    startTransition(async () => {
      await saveApplicationNotes(row.id, notes)
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    })

  const remove = () =>
    startTransition(async () => {
      await deleteApplication(row.id)
      router.refresh()
    })

  return (
    <Panel className={row.status === "rejected" ? "opacity-70" : ""}>
      {/* ------------------------------------------------------ summary row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLES[row.status]}`}
            >
              {row.status}
            </span>
            <span className="font-semibold text-gray-900">{row.name}</span>
            {row.overdue && (
              <span className="bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                over {RETENTION_MONTHS}mo
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-gray-600">
            {row.city} · {labelFor.availability(row.availability)} ·{" "}
            {labelFor.experience(row.experience)}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="whitespace-nowrap text-xs text-gray-500">{ago(row.createdAt)}</span>
          <CaretDown
            className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4">
          {/* Contact first: the whole point of opening a row is to get in touch. */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${row.phone}`}
              className="inline-flex h-10 items-center gap-1.5 border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Phone className="h-4 w-4" />
              {row.phone}
            </a>
            <a
              href={`mailto:${row.email}?subject=${encodeURIComponent(`Your application to WJ Cleaning Services (${row.reference})`)}`}
              className="inline-flex h-10 items-center gap-1.5 border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Envelope className="h-4 w-4" />
              {row.email}
            </a>
          </div>

          <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
            <Detail label="Transport" value={labelFor.transport(row.transport)} />
            <Detail
              label="Languages"
              value={row.languages.map(labelFor.language).join(", ") || "—"}
            />
            <Detail label="Applied" value={fmtDate(row.createdAt)} />
            <Detail label="Reference" value={row.reference} mono />
          </dl>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Motivation</p>
            <p className="mt-1.5 whitespace-pre-wrap border-l-2 border-wj-dark bg-gray-50 px-3 py-2.5 text-sm leading-relaxed text-gray-700">
              {row.motivation}
            </p>
          </div>

          {/* ------------------------------------------------------- status */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => move(s)}
                  disabled={pending || s === row.status}
                  aria-pressed={s === row.status}
                  className={`h-10 border px-3 text-sm font-medium capitalize transition-colors disabled:cursor-not-allowed ${
                    s === row.status
                      ? "border-wj-dark bg-wj-dark text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------- notes */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <label
              htmlFor={`notes-${row.id}`}
              className="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Your notes
            </label>
            <textarea
              id={`notes-${row.id}`}
              rows={2}
              value={notes}
              maxLength={2000}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Called 4 Aug — can start after the 20th."
              className="mt-1.5 w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-wj-dark"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={saveNotes}
                disabled={pending || notes === (row.notes ?? "")}
                className="inline-flex h-10 items-center bg-wj-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-wj-hover disabled:bg-gray-200 disabled:text-gray-400"
              >
                {pending ? <CircleNotch className="h-4 w-4 animate-spin" /> : "Save note"}
              </button>
              {saved && <span className="text-sm text-emerald-700">Saved</span>}
              <span className="text-xs text-gray-500">Only you see this.</span>
            </div>
          </div>

          {/* ------------------------------------------------------- delete */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            {confirmDelete && (
              <span className="text-sm text-gray-600">Delete permanently?</span>
            )}
            <button
              type="button"
              onClick={() => (confirmDelete ? remove() : setConfirmDelete(true))}
              onBlur={() => setConfirmDelete(false)}
              disabled={pending}
              className={`inline-flex h-10 items-center gap-1.5 px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
                confirmDelete
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-gray-500 hover:bg-gray-100 hover:text-red-700"
              }`}
            >
              <Trash className="h-4 w-4" />
              {confirmDelete ? "Yes, delete" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </Panel>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 flex-shrink-0 text-gray-500">{label}</dt>
      <dd className={`min-w-0 text-gray-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  )
}
