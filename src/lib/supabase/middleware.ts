import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Si Supabase non configuré, laisse passer (mode mock)
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: Ne jamais mettre de logique entre createServerClient et getUser
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Routes protégées
  const protectedPaths = ['/profil', '/commandes', '/mes-reservations', '/favoris', '/notifications', '/vendeur', '/admin']
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  // Routes admin - vérification supplémentaire côté serveur dans les pages
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  
  // Routes auth - rediriger si déjà connecté
  const authRoutes = ['/connexion', '/inscription', '/auth/login', '/auth/register']
  const isAuthRoute = authRoutes.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/'
    const url = request.nextUrl.clone()
    url.pathname = redirect
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
