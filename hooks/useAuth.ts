'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { Profile } from '@/types/database';

interface UseAuthResult {
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook d'authentification côté client (menu utilisateur, formulaires).
 * Les contrôles d'accès finaux restent côté serveur — ce hook sert l'UI.
 */
export function useAuth(): UseAuthResult {
  const supabase = createClient();
  const [user, setUser] = useState<UseAuthResult['user']>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser ? { id: authUser.id, email: authUser.email ?? null } : null);
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();
        setProfile((data as Profile | null) ?? null);
      } else {
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void refresh();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh, supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  return { user, profile, loading, signOut, refresh };
}
