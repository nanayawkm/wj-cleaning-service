import { NextResponse } from "next/server"
import { z } from "zod"

import { getDiscountCode } from "@/lib/booking/queries"
import { clientKey, rateLimit } from "@/lib/booking/rate-limit"

/**
 * Checks whether a discount code is usable right now.
 *
 * Answers with a percentage or a flat no — never with a reason. "Expired",
 * "used up" and "no such code" are indistinguishable from the outside, so the
 * endpoint cannot be used to map out which promotions exist or how far through
 * a campaign is.
 *
 * Rate limited because it is guessable by nature: without a limit it would be
 * a free oracle for brute-forcing short codes.
 *
 * This is a convenience for the customer, not a control. The price is always
 * recalculated from the database when the booking is actually created.
 */

const schema = z.object({ code: z.string().trim().min(1).max(40) })

export async function POST(request: Request) {
  const limit = rateLimit(`discount:${clientKey(request)}`, 20, 10 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { valid: false },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    )
  }

  let code: string
  try {
    code = schema.parse(await request.json()).code
  } catch {
    return NextResponse.json({ valid: false })
  }

  const found = await getDiscountCode(code)
  if (!found) return NextResponse.json({ valid: false })

  return NextResponse.json({ valid: true, percentOff: found.percent_off, code: found.code })
}
