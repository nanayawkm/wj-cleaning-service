import "server-only"

/**
 * Small fixed-window rate limiter.
 *
 * In-memory, so it is per-instance: good enough to stop a script hammering the
 * booking endpoint from one address, not a defence against a distributed
 * attack. If this ever runs on more than one instance, move it to Upstash or
 * Supabase — the interface below is deliberately easy to swap.
 */

const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  bucket.count += 1
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { ok: true, remaining: limit - bucket.count, retryAfterSec: 0 }
}

/** Best-effort client address behind Vercel's proxy. */
export function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  return (fwd?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim()
}

/** Periodic sweep so the map cannot grow without bound. */
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k)
}, 60_000).unref?.()
