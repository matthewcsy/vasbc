import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/**
 * Public client — subject to RLS, safe to use in browser code
 * and server components for read-only queries.
 */
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;

/**
 * Secret-key client — bypasses RLS entirely.
 * SERVER-SIDE ONLY: call only from Server Components or Server Actions.
 * Never import or call this from client components.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set");
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return createClient(url, secretKey, { auth: { persistSession: false } });
}
