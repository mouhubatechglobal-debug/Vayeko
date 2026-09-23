'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ServiceCardItem } from '@/types/service';

export interface ServicesFilters {
  q?: string;
  ville?: string;
  categorie?: string;
  page?: number;
}

interface UseServicesResult {
  items: ServiceCardItem[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Liste des services via l'API publique (`GET /api/services`). */
export function useServices(filters: ServicesFilters): UseServicesResult {
  const [items, setItems] = useState<ServiceCardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.ville) params.set('ville', filters.ville);
        if (filters.categorie) params.set('categorie', filters.categorie);
        if (filters.page) params.set('page', String(filters.page));
        const res = await fetch(`/api/services?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { items: ServiceCardItem[]; total: number };
        if (!controller.signal.aborted) {
          setItems(json.items);
          setTotal(json.total);
        }
      } catch {
        if (!controller.signal.aborted) setError('Impossible de charger les services.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void run();
    return () => controller.abort();
  }, [filters.q, filters.ville, filters.categorie, filters.page, nonce]);

  return { items, total, loading, error, refetch };
}
