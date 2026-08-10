import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"

/**
 * The dashboard's shared vocabulary, so every screen is built from the same
 * parts rather than each one inventing its own spacing and borders.
 *
 * Deliberately the same language as the booking flow: square corners, one
 * hairline border, white panels on a light ground, wj-dark reserved for the
 * thing that is currently selected.
 */

export function PageHeader({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">{title}</h1>
        {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      </div>
      {action}
    </header>
  )
}

/**
 * Native div props pass straight through, so a panel can be made interactive
 * without a second recipe growing beside this one.
 */
export function Panel({
  className = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { children: ReactNode }) {
  return (
    <div className={`border border-gray-200 bg-white ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function Stat({
  Icon, label, value,
}: {
  Icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{value}</p>
    </Panel>
  )
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rescheduled: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-gray-100 text-gray-600 ring-gray-500/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  no_show: "bg-red-50 text-red-700 ring-red-600/20",
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
        STATUS_STYLES[status] ?? STATUS_STYLES.completed
      }`}
    >
      {status.replace("_", " ")}
    </span>
  )
}
