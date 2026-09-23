'use client';

import { useEffect, useRef, useState } from 'react';
import type { GlobalSearchResults } from '@/lib/data';

interface UseSearchOptions {
  q: string;
  ville?: string;
  debounceMs?: number;
}

export interface SearchApiItemServices {
  items: GlobalSearchResults['services'];
  total: number;
}
export interface SearchApiItemProduits {
  items: GlobalSearchResults['produits'];
  total: number;
}
export interface SearchApiItemBoutiques {
  items: GlobalSearchResults['boutiques'];
  total: number;
}

interface UseSearchResult extends GlobalSearchResults {
  loading: boolean;
  error: string | null;
}

/**
 * Recherche globale avec debounce — interroge les API publiques.
 * Les éventuelles anciennes requêtes sont annulées.
 */
export function useSearch({ q, ville, debounceMs = 350 }: UseSearchOptions): UseSearchResult {
  const [results, setResults] = useState<GlobalSearchResults>({ services: [], boutiques: [], produits: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = q.trim();
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!query) {
        setResults({ services: [], boutiques: [], produits: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ q: query, pageSize: '6' });
        if (ville) params.set('ville', ville);
        const qs = params.toString();
        const [services, boutiques, produits] = await Promise.all([
          fetch(`/api/services?${qs}`, { signal: controller.signal }).then((r) =>
            r.ok ? (r.json() as Promise<{ items: GlobalSearchResults['services'] }>) : { items: [] },
          ),
          fetch(`/api/boutiques?${qs}`, { signal: controller.signal }).then((r) =>
            r.ok ? (r.json() as Promise<{ items: GlobalSearchResults['boutiques'] }>) : { items: [] },
          ),
          fetch(`/api/produits?${qs}`, { signal: controller.signal }).then((r) =>
            r.ok ? (r.json() as Promise<{ items: GlobalSearchResults['produits'] }>) : { items: [] },
          ),
        ]);
        if (!controller.signal.aborted) {
          setResults({
            services: services.items,
            boutiques: boutiques.items,
            produits: produits.items,
          });
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Recherche indisponible pour le moment.');
          console.error('[vayeko][useSearch]', err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [q, ville, debounceMs]);

  return { ...results, loading, error };
}
