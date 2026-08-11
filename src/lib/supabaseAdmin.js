import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

// Admin-only client using the service role key — bypasses RLS.
// Lazily created so empty env vars during build don't crash import time.
// ONLY use from server code (route handlers), never in the browser.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  return cachedClient;
}