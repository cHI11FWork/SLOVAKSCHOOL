import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const WEBINAR_SUBDOMAIN = "vebinar";

// Renamed from `middleware` in Next.js 16 — see node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // vebinar.<domain> serves app/webinar/* at the root — once that domain is
  // added in Vercel + DNS, no further deploy is needed to stand it up.
  const host = request.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];
  if (subdomain === WEBINAR_SUBDOMAIN && !pathname.startsWith("/webinar")) {
    const url = request.nextUrl.clone();
    url.pathname = `/webinar${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
