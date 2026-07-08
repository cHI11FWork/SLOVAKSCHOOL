import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Server-side client bound to the current request's cookies (respects RLS as the logged-in user). */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component render; session refresh is handled in proxy.ts instead
          }
        },
      },
    }
  );
}
