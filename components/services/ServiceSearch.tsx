import { Icon } from '@/components/ui/Icon';

interface ServiceSearchProps {
  cities: string[];
  defaultQuery?: string;
  defaultCity?: string;
  categorie?: string;
}

/**
 * Zone de recherche des services (formulaire GET natif —
 * fonctionne même sans JavaScript, résultats rendus côté serveur).
 */
export function ServiceSearch({ cities, defaultQuery = '', defaultCity = '', categorie }: ServiceSearchProps) {
  return (
    <form
      action="/services"
      method="GET"
      role="search"
      aria-label="Rechercher un service"
      className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card sm:flex-row"
    >
      {categorie && <input type="hidden" name="categorie" value={categorie} />}
      <label className="relative flex-1">
        <span className="sr-only">Rechercher un service</span>
        <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          maxLength={80}
          placeholder="Nom du service, mot-clé…"
          className="w-full rounded-xl bg-neutral-50 py-3 pl-10 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
        />
      </label>
      <label className="relative sm:w-44">
        <span className="sr-only">Ville</span>
        <Icon name="map-pin" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vayeko-red" />
        <select
          name="ville"
          defaultValue={defaultCity}
          className="w-full appearance-none rounded-xl bg-neutral-50 py-3 pl-9 pr-8 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-vayeko-yellow"
        >
          <option value="">Toutes les villes</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      </label>
      <button
        type="submit"
        className="rounded-xl bg-vayeko-yellow px-5 py-3 text-sm font-extrabold text-vayeko-green-dark shadow transition hover:brightness-105"
      >
        Filtrer
      </button>
    </form>
  );
}
