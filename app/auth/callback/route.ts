import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/database';

/**
 * Callback Supabase Auth (confirmation e-mail / réinitialisation).
 * Échange le `code` PKCE contre une session, puis redirige.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next');
  const origin = url.origin;

  if (code) {
    try {
      const supabase = await getServerSupabase();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('[vayeko][auth-callback]', error);
    }
  }

  // Empêche les redirections ouvertes : uniquement des chemins internes.
  const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/profil';
  return NextResponse.redirect(`${origin}${target}`);
}
