"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  CircleNotch,
  CurrencyEur,
  Eye,
  FileText,
  Plus,
  Receipt,
  ShareNetwork,
  Warning,
} from "@phosphor-icons/react"

import { formatEuro } from "@/lib/invoicing/money"
import { Panel, Stat } from "../ui"
import { getPdfUrl, setInvoicePaid, voidInvoice } from "./actions"
import { InvoiceBuilder } from "./invoice-builder"
import type { InvoiceRow, PickerCustomer, ServiceItem } from "./queries"

/**
 * Tabs split on status alone, never on the clock, and every status lands in
 * exactly one bucket — the same rule the bookings list follows, for the same
 * reason: an invoice must never be reachable only through "All".
 */
const TABS = [
  { id: "open", label: "Open" },
  { id: "paid", label: "Paid" },
  { id: "drafts", label: "Drafts" },
  { id: "void", label: "Void" },
  { id: "test", label: "Test" },
  { id: "all", label: "All" },
] as const

type TabId = (typeof TABS)[number]["id"]

const inTab = (r: InvoiceRow, tab: TabId) => {
  // Practice invoices live only in Test and All. Keeping them out of the other
  // tabs is what stops them being read as money owed, and every invoice is
  // still reachable from somewhere other than All.
  if (tab === "test") return r.isTest
  if (r.isTest) return tab === "all"

  switch (tab) {
    case "open":
      return r.status === "issued"
    case "paid":
      return r.status === "paid"
    case "drafts":
      return r.status === "draft"
    case "void":
      return r.status === "void"
    default:
      return true
  }
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 ring-gray-500/20",
  issued: "bg-amber-50 text-amber-700 ring-amber-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  void: "bg-red-50 text-red-700 ring-red-600/20",
}

const monthKey = (iso: string) => iso.slice(0, 7)

export function InvoiceList({
  invoices,
  customers,
  items,
}: {
  invoices: InvoiceRow[]
  customers: PickerCustomer[]
  items: ServiceItem[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [tab, setTab] = useState<TabId>("open")
  const [q, setQ] = useState("")
  const [building, setBuilding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(() => {
    const thisMonth = monthKey(new Date().toISOString())
    const invoiced = invoices
      .filter(
        (r) =>
          !r.isTest &&
          (r.status === "issued" || r.status === "paid") &&
          r.invoiceDate?.startsWith(thisMonth),
      )
      .reduce((a, r) => a + r.grossCents, 0)
    const outstanding = invoices
      .filter((r) => !r.isTest && r.status === "issued")
      .reduce((a, r) => a + r.grossCents, 0)
    return { invoiced, outstanding }
  }, [invoices])

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return invoices.filter(
      (r) =>
        inTab(r, tab) &&
        (term === "" || `${r.number ?? ""} ${r.customerName}`.toLowerCase().includes(term)),
    )
  }, [invoices, tab, q])

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError(null)
      const r = await fn()
      if (r.ok) router.refresh()
      else setError(r.error ?? "Something went wrong.")
    })

  const view = (id: string) => {
    const tab = openDeferredTab()
    startTransition(async () => {
      setError(null)
      const r = await getPdfUrl(id)
      if (!r.ok) {
        tab.close()
        setError(r.error)
        return
      }
      tab.go(r.data.url)
    })
  }

  const share = (id: string, number: string | null) =>
    startTransition(async () => {
      setError(null)
      const r = await getPdfUrl(id)
      if (!r.ok) {
        setError(r.error)
        return
      }
      await shareOrOpen(r.data.url, r.data.filename, `Factuur ${number ?? ""}`)
    })

  return (
    <div className="space-y-4">
      {error && (
        <Panel className="border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </Panel>
      )}

      {/* Money on this tab counts documents issued. The tiles on Bookings count
          jobs, and the two overlap wherever a booking was invoiced — they are
          not meant to be added together. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Stat Icon={CurrencyEur} label="Invoiced this month" value={formatEuro(stats.invoiced)} />
        <Stat Icon={Warning} label="Outstanding" value={formatEuro(stats.outstanding)} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search number or customer"
          className="h-11 min-w-0 flex-1 border border-gray-300 px-3 text-sm outline-none focus:border-wj-dark"
        />
        <button
          type="button"
          onClick={() => setBuilding(true)}
          className="flex h-11 items-center gap-2 bg-wj-dark px-4 text-sm font-semibold text-white hover:bg-wj-hover"
        >
          <Plus className="h-4 w-4" />
          New invoice
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`h-11 border px-4 text-sm font-medium ${
              tab === t.id
                ? "border-wj-dark bg-wj-dark text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-wj-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-gray-500">
          {rows.length} {rows.length === 1 ? "invoice" : "invoices"}
        </span>
      </div>

      {rows.length === 0 ? (
        <Panel className="py-14 text-center">
          <Receipt className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-medium text-gray-900">Nothing here</p>
          <p className="mt-1 text-sm text-gray-500">
            {tab === "open"
              ? "Invoices waiting to be paid appear here."
              : tab === "test"
                ? "Practice invoices appear here. They never touch your real numbering."
                : "No invoices in this tab."}
          </p>
        </Panel>
      ) : (
        <Panel className="divide-y divide-gray-100">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums text-gray-900">{r.number ?? "Draft"}</span>
                  <span
                    className={`inline-flex whitespace-nowrap px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
                      STATUS_STYLES[r.status]
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.isTest && (
                    <span className="inline-flex whitespace-nowrap bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      test
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-gray-500">
                  {r.customerName}
                  {r.invoiceDate && ` · ${dutch(r.invoiceDate)}`}
                </p>
              </div>

              <span className="font-semibold tabular-nums text-gray-900">{formatEuro(r.grossCents)}</span>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                {r.status !== "draft" && r.status !== "void" && (
                  <button
                    type="button"
                    onClick={() => view(r.id)}
                    disabled={pending}
                    className="flex h-11 flex-1 items-center justify-center gap-2 border border-gray-300 px-3 text-sm font-medium hover:border-wj-dark disabled:opacity-60 sm:flex-none"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                )}

                {r.status !== "draft" && r.status !== "void" && (
                  <button
                    type="button"
                    onClick={() => share(r.id, r.number)}
                    disabled={pending}
                    className="flex h-11 flex-1 items-center justify-center gap-2 border border-gray-300 px-3 text-sm font-medium hover:border-wj-dark disabled:opacity-60 sm:flex-none"
                  >
                    {pending ? (
                      <CircleNotch className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShareNetwork className="h-4 w-4" />
                    )}
                    Share
                  </button>
                )}

                {r.status === "issued" && (
                  <button
                    type="button"
                    onClick={() => run(() => setInvoicePaid(r.id, true))}
                    disabled={pending}
                    className="h-11 flex-1 border border-gray-300 px-3 text-sm font-medium hover:border-wj-dark disabled:opacity-60 sm:flex-none"
                  >
                    Mark paid
                  </button>
                )}

                {(r.status === "issued" || r.status === "paid") && (
                  <button
                    type="button"
                    onClick={() => {
                      const reason = window.prompt(
                        `Void invoice ${r.number}?\n\nThe number stays retired so the series keeps no holes, and you issue a fresh one. This cannot be undone.\n\nReason (optional):`,
                      )
                      if (reason !== null) run(() => voidInvoice(r.id, reason))
                    }}
                    disabled={pending}
                    className="h-11 px-3 text-sm text-gray-500 hover:text-red-700 disabled:opacity-60"
                  >
                    Void
                  </button>
                )}
              </div>
            </div>
          ))}
        </Panel>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        Digiboox stays your bookkeeping — book each invoice there afterwards for your btw-aangifte.
        An issued invoice is never edited: void it and issue a fresh one instead.
      </p>

      {building && (
        <InvoiceBuilder
          customers={customers}
          items={items}
          onClose={() => {
            setBuilding(false)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

const dutch = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-")
  return `${d}-${m}-${y}`
}

/**
 * Opens the tab synchronously, inside the click. window.open() after an await
 * has lost the user-gesture context and pop-up blockers swallow it silently.
 * No "noopener" here, because with it window.open returns null and there is no
 * handle to point at the URL — opener is cleared by hand instead.
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
