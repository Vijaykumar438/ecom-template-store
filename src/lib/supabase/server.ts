import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build, env vars may not be set. Return a safe proxy.
    return new Proxy({} as ReturnType<typeof createServerClient>, {
      get(_target, prop) {
        if (prop === "auth") {
          return new Proxy(
            {},
            {
              get() {
                return async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") });
              },
            }
          );
        }
        if (prop === "from") {
          return () =>
            new Proxy(
              {},
              {
                get() {
                  return () => ({ data: null, error: new Error("Supabase not configured") });
                },
              }
            );
        }
        return undefined;
      },
    });
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
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
          // The `setAll` method is called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}
