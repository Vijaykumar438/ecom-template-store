import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build / pre-render, env vars may not be available.
    // Return a dummy proxy that won't crash at import time.
    // At runtime the real env vars will always be present.
    return new Proxy({} as ReturnType<typeof createBrowserClient>, {
      get(_target, prop) {
        // Allow basic property access without throwing
        if (prop === "auth") {
          return new Proxy(
            {},
            {
              get() {
                return async () => ({ data: null, error: new Error("Supabase not configured") });
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

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}
