import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Gate for /residents.
 *
 * This runs before any admin page renders, so an unauthenticated request never
 * reaches code that could read a customer record. It is the first of three
 * layers, not the only one:
 *
 *   1. here — no session, no page
 *   2. the layout re-checks the allowlist server-side
 *   3. Row Level Security refuses the rows regardless of what the app asks
 *
 * The route itself is not secret and cannot be. Every Shopify store has
 * /residents. What matters is that finding it gets you a login form.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /*
    The manage page is matched only to get headers onto it — it must never hit
    the admin gate below, or a customer following a link from their own
    confirmation email would be bounced to Jackie's login screen.

    no-referrer matters more here than anywhere else on the site: the token
    lives in the query string, and a default referrer policy would hand it to
    any host the page links out to.
  */
  if (pathname.startsWith("/booking/manage")) {
    const res = NextResponse.next({ request })
    res.headers.set("Referrer-Policy", "no-referrer")
    res.headers.set("Cache-Control", "no-store, max-age=0")
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
    return res
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // getUser() revalidates against Supabase rather than trusting the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLogin = pathname === "/residents/login"

  if (!user && !isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/residents/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/residents"
    url.search = ""
    return NextResponse.redirect(url)
  }

  // Admin pages must never be cached by a proxy or a shared browser.
  if (!isLogin) {
    response.headers.set("Cache-Control", "no-store, max-age=0")
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  return response
}

export const config = {
  matcher: ["/residents/:path*", "/booking/manage"],
}
