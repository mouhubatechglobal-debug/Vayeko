import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Clients Supabase côté serveur (Server Components, Route Handlers, Server Actions).
 *
 * - `getServerSupabase()` : respecte le contexte utilisateur (cookies) ET les RLS.
 * - `getAdminSupabase()`  : clé service_role, bypass RLS — UNIQUEMENT côté serveur,
 *                           après vérification explicite des droits, jamais côté client.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export type VayekoServerClient = ReturnType<typeof createServerClient<Database>>;
export type VayekoAdminClient = ReturnType<typeof createSupabaseClient<Database>>;

export async function getServerSupabase(): Promise<VayekoServerClient> {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Appelé depuis un Server Component : le refresh sera fait par le middleware.
        }
      },
    },
  });
}

/** Client admin (service role). Lève une erreur si la clé n'est pas configurée. */
export function getAdminSupabase(): VayekoAdminClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY manquante : opération administrative impossible.',
    );
  }
  return createSupabaseClient<Database>(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
