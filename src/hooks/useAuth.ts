"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getStoredUser, type UserSession } from '@/lib/auth'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: UserSession | null
  loading: boolean
  isSupabaseConfigured: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isSupabaseConfigured: false,
  })

  useEffect(() => {
    const supabase = createClient()
    const isConfigured = !!supabase
    const mockUser = getStoredUser()

    if (!isConfigured) {
      // Mode mock - utiliser localStorage
      setState({
        user: mockUser ? { id: mockUser.id, email: mockUser.email } as any : null,
        profile: mockUser,
        loading: false,
        isSupabaseConfigured: false,
      })
      return
    }

    // Mode Supabase
    const getInitialUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Récupérer profil depuis table profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          // Récupérer rôles
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)

          const userProfile: UserSession = {
            id: user.id,
            email: user.email || '',
            name: profile?.full_name || user.email?.split('@')[0] || 'Utilisateur',
            roles: roles?.map((r: any) => r.role) || ['USER'],
            city: profile?.city || 'Lomé',
            avatar: profile?.avatar_url || `https://i.pravatar.cc/100?u=${user.id}`,
          }

          setState({
            user,
            profile: userProfile,
            loading: false,
            isSupabaseConfigured: true,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            isSupabaseConfigured: true,
          })
        }
      } catch (error) {
        console.error('Erreur auth:', error)
        setState({
          user: null,
          profile: mockUser ? { id: mockUser.id } as any : null,
          loading: false,
          isSupabaseConfigured: true,
        })
      }
    }

    getInitialUser()

    // Écouter changements auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)

        const userProfile: UserSession = {
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.full_name || session.user.email?.split('@')[0] || 'Utilisateur',
          roles: roles?.map((r: any) => r.role) || ['USER'],
          city: profile?.city || 'Lomé',
          avatar: profile?.avatar_url,
        }

        setState({
          user: session.user,
          profile: userProfile,
          loading: false,
          isSupabaseConfigured: true,
        })
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          isSupabaseConfigured: true,
        })
      }
    })

    // Écouter changements mock auth
    const handleMockAuthChange = () => {
      if (!isConfigured) {
        const updatedMockUser = getStoredUser()
        setState(prev => ({
          ...prev,
          user: updatedMockUser ? { id: updatedMockUser.id } as any : null,
          profile: updatedMockUser,
        }))
      }
    }

    window.addEventListener('vayeko-auth-change', handleMockAuthChange)
    window.addEventListener('storage', handleMockAuthChange)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('vayeko-auth-change', handleMockAuthChange)
      window.removeEventListener('storage', handleMockAuthChange)
    }
  }, [])

  const hasRole = (role: string) => {
    return state.profile?.roles.includes(role) || false
  }

  const isAdmin = hasRole('ADMIN')
  const isSeller = hasRole('SELLER') || hasRole('ADMIN')
  const isProfessional = hasRole('PROFESSIONAL') || hasRole('ADMIN')

  return {
    ...state,
    hasRole,
    isAdmin,
    isSeller,
    isProfessional,
    isAuthenticated: !!state.user,
  }
}
