import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Client Supabase navigateur (composants client).
 * N'utilise QUE les variables publiques NEXT_PUBLIC_* — jamais la service key.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export type VayekoClient = ReturnType<typeof createBrowserClient<Database>>;

let browserClient: VayekoClient | null = null;

/** Client Supabase (browser), en singleton. */
export function createClient(): VayekoClient {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

/** Indique si l'application a une vraie configuration Supabase (sinon : mode démo). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
