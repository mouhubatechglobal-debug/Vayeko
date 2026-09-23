import { createClient } from '@/lib/supabase/client'
import { mockUsers, storeUser, clearStoredUser } from '@/lib/auth'

export const authService = {
  async signUp(email: string, password: string, metadata: { full_name: string; city: string; phone?: string }) {
    const supabase = createClient()

    if (!supabase) {
      // Mode mock
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name: metadata.full_name,
        roles: ['USER'],
        city: metadata.city,
        avatar: `https://i.pravatar.cc/100?u=${email}`,
      }
      storeUser(newUser as any)
      window.dispatchEvent(new Event('vayeko-auth-change'))
      return { data: { user: newUser }, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            city: metadata.city,
            phone: metadata.phone,
          }
        }
      })

      if (error) throw error

      // Créer profil
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: metadata.full_name,
            city: metadata.city,
            phone: metadata.phone,
          })

        if (profileError) console.error('Erreur création profil:', profileError)

        // Ajouter rôle USER par défaut
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'USER'
          })

        if (roleError) console.error('Erreur création rôle:', roleError)
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()

    if (!supabase) {
      // Mode mock
      const user = mockUsers.find(u => u.email === email && u.password === password)
      if (!user) {
        return { data: null, error: 'Email ou mot de passe incorrect' }
      }
      storeUser({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        city: user.city,
        avatar: user.avatar,
      } as any)
      window.dispatchEvent(new Event('vayeko-auth-change'))
      return { data: { user }, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async signOut() {
    const supabase = createClient()

    if (!supabase) {
      clearStoredUser()
      window.dispatchEvent(new Event('vayeko-auth-change'))
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  },

  async resetPassword(email: string) {
    const supabase = createClient()

    if (!supabase) {
      return { data: { message: 'Mode mock - email de récupération simulé' }, error: null }
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/mot-de-passe-oublie`,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getCurrentUser() {
    const supabase = createClient()

    if (!supabase) {
      const mockUser = localStorage.getItem('vayeko_user')
      return mockUser ? JSON.parse(mockUser) : null
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch {
      return null
    }
  }
}
