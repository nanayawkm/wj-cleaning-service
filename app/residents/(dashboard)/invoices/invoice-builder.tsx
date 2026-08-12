"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  CaretDown,
  CircleNotch,
  CloudSlash,
  DownloadSimple,
  Plus,
  ShareNetwork,
  Trash,
  X,
} from "@phosphor-icons/react"

import { RATE_HINT, checkInvoice } from "@/lib/invoicing/compliance"
import { calculateInvoice, formatCents, formatEuro, parseCents, roundCents } from "@/lib/invoicing/money"
import type { VatRate } from "@/lib/invoicing/money"
import { Panel } from "../ui"
import { createCustomer, createDraft, deleteDraft, finaliseInvoice, getPdfUrl, saveDraft } from "./actions"
import type { PickerCustomer, ServiceItem } from "./queries"

/**
 * Flow A — the panel builder.
 *
 * The whole invoice lives on one slide-over, the same shape as the booking and
 * customer panels, so there is no second navigation dialect to learn. The
 * running total and the primary action sit in a sticky footer, permanently in
 * the thumb zone, and adding a line is a sheet of large tiles rather than a
 * dropdown.
 *
 * The target is under a minute from her phone, standing in someone's hallway.
 * Nothing on the happy path requires typing an address, a rate, a date or a
 * number — those come from the customer, the segment, the clock and the
 * counter.
 */

interface Line {
  key: string
  description: string
  subline: string
  unitCents: number
  qty: number
  vatRate: VatRate
  bookingId?: string | null
}

const newKey = () => Math.random().toString(36).slice(2)

/** Today where she is, not where the server is. */
const todayIso = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

/**
 * Her own KvK and btw-nummer are seeded and edited in the database, not here,
 * so the browser has nothing to check them against. Treated as present for the
 * button state; `finaliseInvoice` verifies them properly and refuses if they
 * are missing.
 */
const settingsOk = {
  companyName: "—",
  street: "—",
  postcode: "—",
  city: "—",
  kvk: "—",
  vatNumber: "—",
}

export interface BuilderPrefill {
  customerId: string
  lines: Omit<Line, "key">[]
}

export function InvoiceBuilder({
  customers,
  items,
  prefill,
  onClose,
}: {
  customers: PickerCustomer[]
  items: ServiceItem[]
  prefill?: BuilderPrefill
  onClose: () => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [customerId, setCustomerId] = useState<string | null>(prefill?.customerId ?? null)
  const [lines, setLines] = useState<Line[]>(
    () => prefill?.lines.map((l) => ({ ...l, key: newKey() })) ?? [],
  )
  const [picking, setPicking] = useState(!prefill)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [issued, setIssued] = useState<{ id: string; number: string } | null>(null)
  // A practice run takes its own TEST-0001 series and never advances the real
  // month counter, so trying the feature out costs nothing.
  const [isTest, setIsTest] = useState(false)
  // Defaulted, never asked for. The date the work was done is legally required
  // on the invoice, and on the doorstep it is always today — so it is filled in
  // rather than prompted, and the fast path stays exactly as fast.
  const [serviceDate, setServiceDate] = useState(todayIso)
  const [reverseCharge, setReverseCharge] = useState(false)

  const draftId = useRef<string | null>(null)
  // Stable for the life of this invoice, so a retry after a dropped connection
  // returns the same invoice instead of taking a second number.
  const clientToken = useRef(newKey() + newKey())

  const online = useOnline()

  const customer = customers.find((c) => c.id === customerId) ?? null
  const [pricesIncludeVat, setPricesIncludeVat] = useState(true)

  // The segment sets the default. Flipping it stays possible, but she should
  // never have to think about it on the doorstep.
  useEffect(() => {
    if (customer) setPricesIncludeVat(customer.segment === "residential")
  }, [customer?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const totals = useMemo(
    () => calculateInvoice(lines.map((l) => ({ unitCents: l.unitCents, qty: l.qty, vatRate: l.vatRate })), pricesIncludeVat),
    [lines, pricesIncludeVat],
  )

  /* ───────────────────────────────────────────────── autosave the draft */

  const persist = useCallback(async () => {
    if (!customerId || issued) return
    if (!draftId.current) {
      const r = await createDraft(customerId, isTest)
      if (!r.ok) return
      draftId.current = r.data.id
    }
    await saveDraft(draftId.current, {
      lines: lines.map((l) => ({
        description: l.description,
        subline: l.subline,
        unitCents: l.unitCents,
        qty: l.qty,
        vatRate: l.vatRate,
        bookingId: l.bookingId ?? null,
      })),
      pricesIncludeVat,
      language: "nl",
      serviceDate,
      reverseCharge,
    })
  }, [customerId, lines, pricesIncludeVat, issued, isTest, serviceDate, reverseCharge])

  // A phone call mid-invoice must not lose the work. Debounced so typing a
  // description does not write on every keystroke.
  useEffect(() => {
    if (!customerId || lines.length === 0 || issued) return
    const t = setTimeout(() => void persist(), 800)
    return () => clearTimeout(t)
  }, [customerId, lines, pricesIncludeVat, issued, persist])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !sheetOpen && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, sheetOpen])

  /* ────────────────────────────────────────────────────────── actions */

  const addItem = (item: ServiceItem) => {
    setLines((ls) => {
      // Tapping the same service again bumps the quantity rather than adding a
      // second identical row — two "Wissel schoonmaak ×1" lines is never what
      // she meant.
      const at = ls.findIndex((l) => l.description === item.nameNl && !l.subline)
      if (at >= 0) {
        const next = [...ls]
        next[at] = { ...next[at], qty: next[at].qty + 1 }
        return next
      }
      return [
        ...ls,
        {
          key: newKey(),
          description: item.nameNl,
          subline: "",
          unitCents: item.unitCents,
          qty: 1,
          vatRate: item.vatRate,
        },
      ]
    })
    setSheetOpen(false)
  }

  const addFreeLine = () => {
    setLines((ls) => [
      ...ls,
      {
        key: newKey(),
        description: "",
        subline: "",
        unitCents: 0,
        qty: 1,
        vatRate: customer?.segment === "business" ? 21 : 9,
      },
    ])
    setSheetOpen(false)
  }

  const addDiscount = () => {
    setLines((ls) => [
      ...ls,
      {
        key: newKey(),
        description: "Korting",
        subline: "",
        unitCents: 0,
        qty: 1,
        // Follows the rate of the work it reduces, so the btw comes out right.
        vatRate: ls.length ? ls[ls.length - 1].vatRate : customer?.segment === "business" ? 21 : 9,
      },
    ])
    setSheetOpen(false)
  }

  const patch = (key: string, p: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...p } : l)))

  const remove = (key: string) => setLines((ls) => ls.filter((l) => l.key !== key))

  const finalise = () =>
    startTransition(async () => {
      setError(null)
      await persist()
      if (!draftId.current) {
        setError("Could not save the invoice. Please try again.")
        return
      }
      const r = await finaliseInvoice(draftId.current, clientToken.current)
      if (r.ok) {
        // The panel deliberately stays open and the state flips in place,
        // exactly as marking a booking done already behaves. A row vanishing
        // under the reader reads as deletion.
        setIssued({ id: draftId.current, number: r.data.number })
        router.refresh()
      } else {
        setError(r.error)
      }
    })

  // Viewing must never become sharing. She should be able to read the invoice
  // before it goes anywhere near a customer.
  const view = () => {
    if (!issued) return
    const tab = openDeferredTab()
    startTransition(async () => {
      setError(null)
      const r = await getPdfUrl(issued.id)
      if (!r.ok) {
        tab.close()
        setError(r.error)
        return
      }
      tab.go(r.data.url)
    })
  }

  const share = () =>
    startTransition(async () => {
      if (!issued) return
      setError(null)
      const r = await getPdfUrl(issued.id)
      if (!r.ok) {
        setError(r.error)
        return
      }
      await shareOrOpen(r.data.url, r.data.filename, `Factuur ${issued.number}`)
    })

  const discard = () =>
    startTransition(async () => {
      if (draftId.current) await deleteDraft(draftId.current)
      router.refresh()
      onClose()
    })

  /* ─────────────────────────────────────────────────────────── render */

  // The same rules the server enforces, run here purely so the button can say
  // why it is not available. The server is what actually decides.
  const blockers = customer
    ? checkInvoice({
        // Her own details live in Settings and are assumed present here; the
        // server checks them for real and will refuse if they are not.
        issuer: settingsOk,
        billTo: {
          name: customer.companyName || customer.name,
          street: customer.street,
          postcode: customer.postcode,
          city: customer.city,
          vatNumber: customer.vatNumber,
        },
        lines: lines.map((l) => ({ description: l.description, qty: l.qty })),
        serviceDate,
        reverseCharge,
      })
    : [{ where: "invoice" as const, message: "Choose a customer." }]

  const canFinalise = blockers.length === 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={issued ? `Factuur ${issued.number}` : "New invoice"}
        className="relative flex h-full w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-gray-900">
              {issued ? `Factuur ${issued.number}` : "New invoice"}
            </h2>
            {/* Pinned here so the customer stays visible once the lines push
                it off the top of a long invoice. */}
            <p className="truncate text-sm text-gray-500">
              {customer ? displayName(customer) : "Choose a customer"}
              {customer && (
                <span className="ml-2 text-xs uppercase tracking-wide text-gray-400">
                  {customer.segment === "business" ? "21% excl." : "9% incl."}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {error && (
            <Panel className="mb-4 border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </Panel>
          )}

          {issued ? (
            <IssuedSummary
              number={issued.number}
              totals={totals}
              pricesIncludeVat={pricesIncludeVat}
              onView={view}
              onShare={share}
              busy={pending}
            />
          ) : picking || !customer ? (
            <CustomerPicker
              customers={customers}
              onPick={(id) => {
                setCustomerId(id)
                setPicking(false)
              }}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPicking(true)}
                className="mb-4 flex h-11 w-full items-center justify-between border border-gray-300 px-3 text-left text-sm hover:border-wj-dark"
              >
                <span className="truncate font-medium text-gray-900">{displayName(customer)}</span>
                <CaretDown className="h-4 w-4 shrink-0 text-gray-400" />
              </button>

              <LineEditor lines={lines} onPatch={patch} onRemove={remove} />

              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 border border-dashed border-gray-300 text-sm font-medium text-gray-700 hover:border-wj-dark hover:text-wj-dark"
              >
                <Plus className="h-4 w-4" />
                Add line
              </button>

              {/* Guidance, not enforcement — which rate applies is hers and her
                  accountant's call, and the invoice is legally hers. */}
              {lines.length > 0 && <p className="mt-2 text-xs text-gray-500">{RATE_HINT}</p>}

              <label className="mt-5 flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isTest}
                  disabled={Boolean(draftId.current)}
                  onChange={(e) => setIsTest(e.target.checked)}
                  className="h-4 w-4 accent-amber-600"
                />
                Practice invoice
              </label>
              <p className="mt-1 text-xs text-gray-500">
                {draftId.current
                  ? "Set before the first line is added — it cannot change once the draft exists."
                  : "Numbered TEST-0001 and marked on the PDF. Keeps your real numbering untouched."}
              </p>

              <label className="mt-4 flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={pricesIncludeVat}
                  onChange={(e) => setPricesIncludeVat(e.target.checked)}
                  className="h-4 w-4 accent-wj-dark"
                />
                Prices include btw
              </label>
              <p className="mt-1 text-xs text-gray-500">
                {pricesIncludeVat
                  ? "btw is taken out of the price shown, so the total is what you quoted."
                  : "btw is added on top of the prices shown."}
              </p>

              {/* Filled in already, because the doorstep case is always today.
                  It only has to be changed when she is billing older work. */}
              <label className="mt-4 block text-sm text-gray-700">
                Work done on
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="mt-1 block h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-wj-dark"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Only printed when it is not the same day as the invoice.
              </p>

              {/* Hidden for private customers, where it can never apply. */}
              {customer?.segment === "business" && (
                <>
                  <label className="mt-4 flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={reverseCharge}
                      onChange={(e) => setReverseCharge(e.target.checked)}
                      className="h-4 w-4 accent-wj-dark"
                    />
                    Btw verlegd
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    For work where the customer pays the btw instead of you — usually staffing.
                    Their btw-nummer has to be on file.
                  </p>
                </>
              )}

              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={discard}
                  disabled={pending}
                  className="mt-6 text-xs text-gray-500 underline underline-offset-2 hover:text-red-700"
                >
                  Discard this draft
                </button>
              )}
            </>
          )}
        </div>

        {/* ── sticky footer: total and the one action, always under her thumb */}
        {!picking && customer && (
          <footer className="border-t border-gray-200 bg-white px-5 py-3">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm text-gray-500">
                {totals.mixed ? "Totaal te voldoen" : pricesIncludeVat ? "Totaal (incl. btw)" : "Totaal te voldoen"}
              </span>
              <span className="text-xl font-semibold tabular-nums text-gray-900">
                {formatEuro(totals.grossCents)}
              </span>
            </div>

            {!online && !issued && (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-amber-700">
                <CloudSlash className="h-4 w-4 shrink-0" />
                Saved — no connection. Finalise when you&apos;re back online.
              </p>
            )}

            {/* Only once there is something to finalise, so a blank invoice she
                has just opened is not greeted by a list of faults. */}
            {!issued && lines.length > 0 && blockers.length > 0 && (
              <ul className="mb-2 space-y-1">
                {blockers.map((b) => (
                  <li key={b.message} className="text-xs text-amber-700">
                    {b.message}
                    {b.where === "customer" && " Fix it on the Customers tab."}
                    {b.where === "settings" && " Fix it in Settings."}
                  </li>
                ))}
              </ul>
            )}

            {issued ? (
              <button
                type="button"
                onClick={share}
                disabled={pending}
                className="flex h-11 w-full items-center justify-center gap-2 bg-wj-dark text-sm font-semibold text-white hover:bg-wj-hover disabled:opacity-60"
              >
                {pending ? <CircleNotch className="h-4 w-4 animate-spin" /> : <ShareNetwork className="h-4 w-4" />}
                Share PDF
              </button>
            ) : (
              <button
                type="button"
                onClick={finalise}
                disabled={!canFinalise || pending || !online}
                className="flex h-11 w-full items-center justify-center gap-2 bg-wj-dark text-sm font-semibold text-white hover:bg-wj-hover disabled:opacity-50"
              >
                {pending && <CircleNotch className="h-4 w-4 animate-spin" />}
                Finalise invoice
              </button>
            )}
          </footer>
        )}

        {sheetOpen && (
          <ServiceSheet
            items={items.filter((i) => i.segment === (customer?.segment ?? "residential"))}
            onPick={addItem}
            onFree={addFreeLine}
            onDiscount={addDiscount}
            onClose={() => setSheetOpen(false)}
          />
        )}
      </aside>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ sub-views */

function IssuedSummary({
  number,
  totals,
  pricesIncludeVat,
  onView,
  onShare,
  busy,
}: {
  number: string
  totals: ReturnType<typeof calculateInvoice>
  pricesIncludeVat: boolean
  onView: () => void
  onShare: () => void
  busy: boolean
}) {
  return (
    <div>
      <Panel className="border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-medium text-emerald-900">Invoice {number} is issued.</p>
        <p className="mt-1 text-sm text-emerald-800">
          The PDF is saved. Share it now, or find it again in the list at any time.
        </p>
      </Panel>

      <dl className="mt-5 space-y-1.5 text-sm">
        <Row label={pricesIncludeVat && !totals.mixed ? "Subtotaal excl. btw" : "Subtotaal"} value={formatEuro(totals.netCents)} />
        {totals.breakdown.map((b) => (
          <Row
            key={b.rate}
            label={totals.mixed ? `Btw ${b.rate}% over ${formatEuro(b.netCents)}` : `${b.rate}% btw`}
            value={formatEuro(b.vatCents)}
          />
        ))}
        <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
          <dt>Totaal te voldoen</dt>
          <dd className="tabular-nums">{formatEuro(totals.grossCents)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onView}
        disabled={busy}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 border border-gray-300 text-sm font-medium hover:border-wj-dark disabled:opacity-60"
      >
        <DownloadSimple className="h-4 w-4" />
        Open the PDF
      </button>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-gray-600">
    <dt>{label}</dt>
    <dd className="tabular-nums">{value}</dd>
  </div>
)

/**
 * Most business customers never touch the booking form — the villa work came
 * from people who never used the app — so adding one has to be possible from
 * inside this flow. Sending her to another tab mid-invoice would lose the
 * draft she is standing there building.
 */
function NewCustomerForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [segment, setSegment] = useState<"residential" | "business">("business")
  const [f, setF] = useState({
    name: "",
    companyName: "",
    attn: "",
    street: "",
    postcode: "",
    city: "",
    phone: "",
    email: "",
  })

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = () =>
    startTransition(async () => {
      setError(null)
      const r = await createCustomer({ ...f, segment })
      if (r.ok) onCreated(r.data.id)
      else setError(r.error)
    })

  const field = "h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-wj-dark"

  return (
    <div className="space-y-3">
      {error && (
        <Panel className="border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </Panel>
      )}

      <div className="flex gap-2">
        {(["residential", "business"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSegment(s)}
            className={`h-11 flex-1 border text-sm font-medium capitalize ${
              segment === s
                ? "border-wj-dark bg-wj-dark text-white"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            {s === "business" ? "Business · 21%" : "Private · 9%"}
          </button>
        ))}
      </div>

      {segment === "business" && (
        <>
          <input className={field} placeholder="Company name" value={f.companyName} onChange={set("companyName")} />
          <input className={field} placeholder="T.a.v. — contact person, optional" value={f.attn} onChange={set("attn")} />
        </>
      )}
      <input className={field} placeholder="Name" value={f.name} onChange={set("name")} />
      <input className={field} placeholder="Street and number" value={f.street} onChange={set("street")} />
      <div className="flex gap-2">
        <input className={`${field} w-28`} placeholder="1234 AB" value={f.postcode} onChange={set("postcode")} />
        <input className={field} placeholder="City" value={f.city} onChange={set("city")} />
      </div>
      <input className={field} placeholder="Phone — optional" value={f.phone} onChange={set("phone")} />
      <input className={field} placeholder="Email — optional" value={f.email} onChange={set("email")} />

      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 bg-wj-dark text-sm font-semibold text-white hover:bg-wj-hover disabled:opacity-60"
      >
        {pending && <CircleNotch className="h-4 w-4 animate-spin" />}
        Save customer
      </button>
    </div>
  )
}

function CustomerPicker({
  customers,
  onPick,
}: {
  customers: PickerCustomer[]
  onPick: (id: string) => void
}) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [q, setQ] = useState("")

  // Recently invoiced first — the doorstep case is nearly always a repeat.
  const ordered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return customers
      .filter((c) =>
        term === ""
          ? true
          : `${c.name} ${c.companyName ?? ""} ${c.city}`.toLowerCase().includes(term),
      )
      .sort((a, b) => (b.lastInvoicedAt ?? "").localeCompare(a.lastInvoicedAt ?? ""))
      .slice(0, 40)
  }, [customers, q])

  // Every hook above must run on every render. This branch sat above the
  // useMemo once, which skipped it whenever the form was open and took the
  // whole panel down with "rendered fewer hooks than expected".
  if (adding) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setAdding(false)}
          className="mb-3 text-sm text-gray-500 underline underline-offset-2"
        >
          Back to the list
        </button>
        <NewCustomerForm
          onCreated={(id) => {
            // Refresh so the new row is in `customers` next render; the invoice
            // can be built against the id immediately either way.
            router.refresh()
            onPick(id)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, company or city"
        className="h-11 w-full border border-gray-300 px-3 text-sm outline-none focus:border-wj-dark"
      />
      <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
        {ordered.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onPick(c.id)}
              className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-gray-50"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gray-900">{displayName(c)}</span>
                <span className="block truncate text-xs text-gray-500">
                  {[c.street, c.city].filter(Boolean).join(", ")}
                </span>
              </span>
              <span className="shrink-0 text-xs uppercase tracking-wide text-gray-400">
                {c.segment === "business" ? "21%" : "9%"}
              </span>
            </button>
          </li>
        ))}
        {ordered.length === 0 && (
          <li className="py-6 text-center text-sm text-gray-500">No one matches.</li>
        )}
      </ul>

      <button
        type="button"
        onClick={() => setAdding(true)}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 border border-dashed border-gray-300 text-sm font-medium text-gray-700 hover:border-wj-dark hover:text-wj-dark"
      >
        <Plus className="h-4 w-4" />
        New customer
      </button>
    </div>
  )
}

function LineEditor({
  lines,
  onPatch,
  onRemove,
}: {
  lines: Line[]
  onPatch: (key: string, p: Partial<Line>) => void
  onRemove: (key: string) => void
}) {
  if (lines.length === 0) {
    return (
      <p className="border border-dashed border-gray-200 py-8 text-center text-sm text-gray-500">
        No lines yet.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {lines.map((l) => (
        <li key={l.key} className="border border-gray-200 p-3">
          <div className="flex items-start gap-2">
            <input
              value={l.description}
              onChange={(e) => onPatch(l.key, { description: e.target.value })}
              placeholder="Description"
              className="h-9 min-w-0 flex-1 border-b border-transparent text-sm font-medium outline-none focus:border-wj-dark"
            />
            <button
              type="button"
              onClick={() => onRemove(l.key)}
              aria-label="Remove line"
              className="-m-1 flex h-9 w-9 shrink-0 items-center justify-center text-gray-300 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>

          <input
            value={l.subline}
            onChange={(e) => onPatch(l.key, { subline: e.target.value })}
            placeholder="Date and place — optional"
            className="h-8 w-full border-b border-transparent text-xs text-gray-500 outline-none focus:border-wj-dark"
          />

          <div className="mt-2 flex items-center gap-2">
            <CentsInput
              value={l.unitCents}
              onCommit={(cents) => onPatch(l.key, { unitCents: cents })}
              label="Unit price"
            />
            <span className="text-xs text-gray-400">×</span>
            <input
              inputMode="decimal"
              defaultValue={String(l.qty)}
              onBlur={(e) => {
                const n = Number(e.target.value.replace(",", "."))
                onPatch(l.key, { qty: Number.isFinite(n) && n !== 0 ? n : 1 })
              }}
              aria-label="Quantity"
              className="h-9 w-14 border border-gray-300 px-2 text-center text-sm tabular-nums outline-none focus:border-wj-dark"
            />
            <select
              value={l.vatRate}
              onChange={(e) => onPatch(l.key, { vatRate: Number(e.target.value) as VatRate })}
              aria-label="btw rate"
              className="h-9 border border-gray-300 px-1 text-sm outline-none focus:border-wj-dark"
            >
              <option value={9}>9%</option>
              <option value={21}>21%</option>
              <option value={0}>0%</option>
            </select>
            <span className="ml-auto text-sm font-semibold tabular-nums text-gray-900">
              {formatEuro(roundCents(l.unitCents * l.qty))}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function CentsInput({
  value,
  onCommit,
  label,
}: {
  value: number
  onCommit: (cents: number) => void
  label: string
}) {
  const [text, setText] = useState(formatCents(value))

  useEffect(() => setText(formatCents(value)), [value])

  return (
    <span className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-2 text-sm text-gray-500">€</span>
      <input
        inputMode="decimal"
        aria-label={label}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const cents = parseCents(text)
          if (cents === null) setText(formatCents(value))
          else onCommit(cents)
        }}
        className="h-9 w-24 border border-gray-300 pl-6 pr-2 text-right text-sm tabular-nums outline-none focus:border-wj-dark"
      />
    </span>
  )
}

/**
 * The tile grid, borrowed from the POS flow. This is where the taps actually
 * accumulate, so it is one tap per service and no typing.
 */
function ServiceSheet({
  items,
  onPick,
  onFree,
  onDiscount,
  onClose,
}: {
  items: ServiceItem[]
  onPick: (i: ServiceItem) => void
  onFree: () => void
  onDiscount: () => void
  onClose: () => void
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-gray-900/30" />
      <div className="relative max-h-[80%] overflow-y-auto border-t-2 border-wj-dark bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Add a line</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-2 flex h-11 w-11 items-center justify-center text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {items.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => onPick(i)}
              className="min-h-[4.5rem] border border-gray-200 p-3 text-left hover:border-wj-dark"
            >
              <span className="block text-sm font-medium leading-snug text-gray-900">{i.nameNl}</span>
              <span className="mt-1 block text-sm tabular-nums text-gray-500">
                {formatEuro(i.unitCents)}
              </span>
            </button>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">
            No saved services for this customer type yet. Add them in Settings.
          </p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onFree}
            className="flex h-11 items-center justify-center gap-2 border border-gray-300 text-sm font-medium hover:border-wj-dark"
          >
            <Plus className="h-4 w-4" />
            Something else
          </button>
          <button
            type="button"
            onClick={onDiscount}
            className="flex h-11 items-center justify-center gap-2 border border-gray-300 text-sm font-medium hover:border-wj-dark"
          >
            Discount
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ helpers */

const displayName = (c: PickerCustomer) => c.companyName || c.name

/**
 * Whether the browser thinks it has a connection.
 *
 * Used to disable Finalise rather than to fake success. The invoice number
 * comes from the server, so in a stairwell she genuinely cannot finalise —
 * saying so is the honest thing, and the draft is already safe.
 */
function useOnline() {
  const [online, setOnline] = useState(true)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    update()
    addEventListener("online", update)
    addEventListener("offline", update)
    return () => {
      removeEventListener("online", update)
      removeEventListener("offline", update)
    }
  }, [])
  return online
}

/**
 * Hands the actual file to WhatsApp where the browser allows it, and falls
 * back to opening the PDF otherwise. Sharing a link instead of the file would
 * be useless — the bucket is private and the link expires.
 */
/**
 * Opens the tab synchronously, inside the click.
 *
 * Calling window.open() after an await has lost the user-gesture context and
 * pop-up blockers silently swallow it — the button would simply do nothing.
 * Note the missing noopener: with it, window.open returns null and there is
 * no handle left to point at the URL, so opener is cleared by hand instead.
 */
function openDeferredTab() {
  const w = window.open("", "_blank")
  if (w) w.opener = null
  return {
    go: (url: string) => {
      if (w && !w.closed) w.location.href = url
      else window.open(url, "_blank", "noopener")
    },
    close: () => w?.close(),
  }
}

async function shareOrOpen(url: string, filename: string, title: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const file = new File([blob], filename, { type: "application/pdf" })

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title })
      return
    }
  } catch {
    // Falls through to opening the PDF, which always works.
  }
  window.open(url, "_blank", "noopener")
}
