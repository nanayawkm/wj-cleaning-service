import { getPricingBands } from "@/lib/booking/queries"
import { formatCents } from "@/lib/booking/pricing"
import HomeContent from "./home-content"

// Prices come from the same table the booking flow reads, so the "from"
// figure on the hero can never drift from what customers are charged.
export const dynamic = "force-dynamic"

export default async function Page() {
  const bands = await getPricingBands()
  const lowest = bands.reduce(
    (min, b) => (b.base_cents < min ? b.base_cents : min),
    bands[0]?.base_cents ?? 8900,
  )
  return <HomeContent fromPrice={formatCents(lowest, "nl")} />
}
