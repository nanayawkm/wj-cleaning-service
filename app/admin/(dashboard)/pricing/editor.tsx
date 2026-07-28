"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, CircleNotch } from "@phosphor-icons/react"

import { Panel } from "../ui"
import { updateAddonPrice, updateBandPrice } from "./actions"

interface Band {
  id: string
  label_en: string
  base_cents: number
  deep_cents: number
}
interface Addon {
  id: string
  slug: string
  name_en: string
  price_cents: number
  duration_min: number
}

const eur = (cents: number) => (cents / 100).toFixed(2)

/**
 * Each field saves on blur rather than behind a form-wide Save button. There
 * is no draft state to lose track of, and no way to change four numbers and
 * have only three of them stored.
 */
export function PricingEditor({ bands, addons }: { bands: Band[]; addons: Addon[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const save = (key: string, run: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError(null)
      const r = await run()
      if (r.ok) {
        setSaved(key)
        setTimeout(() => setSaved((s) => (s === key ? null : s)), 2000)
        router.refresh()
      } else {
        setError(r.error ?? "Could not save.")
      }
    })

  return (
    <div className="space-y-4">
      {error && (
        <Panel className="border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </Panel>
      )}

      <Panel className="p-4 sm:p-5">
        <h2 className="font-semibold text-gray-900">Cleaning by size</h2>
        <p className="mt-1 text-sm text-gray-500">
          The base price, and what a deep clean adds on top of it. Changes show on the booking
          page straight away.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4">Size</th>
                <th className="pb-3 pr-4">Base</th>
                <th className="pb-3 pr-4">+ Deep clean</th>
                <th className="pb-3">Total with deep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bands.map((b) => (
                <tr key={b.id}>
                  <td className="py-3 pr-4 font-medium text-gray-900">{b.label_en}</td>
                  <td className="py-3 pr-4">
                    <Money
                      defaultValue={eur(b.base_cents)}
                      busy={pending}
                      saved={saved === `${b.id}-base`}
                      onCommit={(v) => save(`${b.id}-base`, () => updateBandPrice(b.id, "base_cents", v))}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <Money
                      defaultValue={eur(b.deep_cents)}
                      busy={pending}
                      saved={saved === `${b.id}-deep`}
                      onCommit={(v) => save(`${b.id}-deep`, () => updateBandPrice(b.id, "deep_cents", v))}
                    />
                  </td>
                  <td className="py-3 font-semibold text-gray-900 tabular-nums">
                    € {eur(b.base_cents + b.deep_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h2 className="font-semibold text-gray-900">Extras</h2>
        <p className="mt-1 text-sm text-gray-500">
          Deep cleaning is priced per size above, so it is not listed here.
        </p>

        <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
          {addons
            .filter((a) => a.slug !== "deep-cleaning")
            .map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{a.name_en}</p>
                  <p className="text-xs text-gray-500">Adds {a.duration_min} min to the job</p>
                </div>
                <Money
                  defaultValue={eur(a.price_cents)}
                  busy={pending}
                  saved={saved === a.id}
                  onCommit={(v) => save(a.id, () => updateAddonPrice(a.id, v))}
                />
              </li>
            ))}
        </ul>
      </Panel>

      <p className="text-xs leading-relaxed text-gray-500">
        Bookings already taken keep the price they were quoted — changing a number here never
        rewrites what a customer agreed to.
      </p>
    </div>
  )
}

function Money({
  defaultValue, onCommit, busy, saved,
}: {
  defaultValue: string
  onCommit: (v: string) => void
  busy: boolean
  saved: boolean
}) {
  const [value, setValue] = useState(defaultValue)

  return (
    <span className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-2.5 text-sm text-gray-500">€</span>
      <input
        inputMode="decimal"
        value={value}
        disabled={busy}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => value !== defaultValue && onCommit(value)}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="h-10 w-28 border border-gray-300 bg-white pl-6 pr-7 text-sm tabular-nums outline-none transition-colors focus:border-wj-dark disabled:opacity-50"
      />
      {saved && (
        <Check weight="bold" className="pointer-events-none absolute right-2 h-4 w-4 text-emerald-600" />
      )}
      {busy && !saved && (
        <CircleNotch className="pointer-events-none absolute right-2 h-3.5 w-3.5 animate-spin text-gray-400" />
      )}
    </span>
  )
}
