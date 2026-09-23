import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Fallback pour dev sans Supabase configuré - retourne null et utilise mock data
  if (!supabaseUrl || !supabaseAnonKey) {
    return null as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Client singleton pour usage côté client
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env vars manquantes - utilisation données mock')
    return null as any
  }
  
  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}
