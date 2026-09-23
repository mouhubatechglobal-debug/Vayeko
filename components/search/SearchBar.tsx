'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SearchBarProps {
  cities: string[];
  defaultQuery?: string;
  defaultCity?: string;
  compact?: boolean;
}

/**
 * Barre de recherche principale (hero) : requête + ville + bouton jaune.
 * Redirige vers /recherche avec les paramètres validés côté serveur.
 */
export function SearchBar({ cities, defaultQuery = '', defaultCity = 'Lomé', compact = false }: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery);
  const [ville, setVille] = useState(defaultCity);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const query = q.trim().slice(0, 80);
    if (query) params.set('q', query);
    if (ville) params.set('ville', ville);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <form
      role="search"
      aria-label="Recherche Vayeko"
      onSubmit={onSubmit}
      className={
        compact
          ? 'flex w-full items-center gap-2'
          : 'flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-lift sm:flex-row sm:items-center'
      }
    >
      <label className="relative flex-1" htmlFor="vayeko-search-q">
        <span className="sr-only">Que recherchez-vous ?</span>
        <Icon
          name="search"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400"
        />
        <input
          id="vayeko-search-q"
          type="search"
          value={q}
          maxLength={80}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Que recherchez-vous ?"
          className="w-full rounded-xl border-0 bg-neutral-50 py-3 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
        />
      </label>

      <label className="sm:w-44" htmlFor="vayeko-search-ville">
        <span className="sr-only">Ville</span>
        <span className="relative block">
          <Icon
            name="map-pin"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vayeko-red"
          />
          <select
            id="vayeko-search-ville"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="w-full appearance-none rounded-xl border-0 bg-neutral-50 py-3 pl-9 pr-8 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          />
        </span>
      </label>

      <button
        type="submit"
        className="rounded-xl bg-vayeko-yellow px-5 py-3 text-sm font-extrabold text-vayeko-green-dark shadow transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-green"
      >
        <span className="inline-flex items-center gap-2">
          <Icon name="search" className="h-4 w-4" />
          Rechercher
        </span>
      </button>
    </form>
  );
}
