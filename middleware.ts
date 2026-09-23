import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * Middleware : rafraîchit la session Supabase et protège les zones privées.
 *
 * ⚠️ L'authentification du middleware est une 1re ligne de contrôle :
 * la VÉRIFICATION du rôle (admin/commerçant) est refaite côté serveur
 * dans les layouts / server actions / RLS. L'URL seule ne donne jamais accès.
 */

const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/profil'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Sans configuration Supabase (mode démo), les pages publiques restent accessibles ;
  // seules les zones privées redirigent vers la page de connexion explicative.
  if (!isSupabaseConfigured()) {
    if (isProtected) {
      const login = new URL('/connexion', request.url);
      login.searchParams.set('mode', 'demo');
      return NextResponse.redirect(login);
    }
    return NextResponse.next({ request });
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
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const login = new URL('/connexion', request.url);
    login.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: [
    // Déclenché sur toutes les routes de l'app sauf les assets statiques.
    '/((?!_next/static|_next/image|favicon.ico|icon.png|images/|logos/|icons/).*)',
  ],
};
