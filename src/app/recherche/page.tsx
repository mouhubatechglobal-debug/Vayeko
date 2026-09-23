"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, MapPin, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { products, services, properties, jobs, listings, shops } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

function RechercheContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCity = searchParams.get('ville') || 'Toutes'

  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const [activeTab, setActiveTab] = useState<'all' | 'produits' | 'boutiques' | 'services' | 'immobilier' | 'emploi' | 'annonces'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const cityFilter = city === 'Toutes' ? null : city

    const prod = products.filter(p => 
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      (!cityFilter || p.city === cityFilter)
    )
    const serv = services.filter(s =>
      (!q || s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) &&
      (!cityFilter || s.city === cityFilter)
    )
    const shop = shops.filter(s =>
      (!q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) &&
      (!cityFilter || s.city === cityFilter)
    )
    const immo = properties.filter(p =>
      (!q || p.title.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)) &&
      (!cityFilter || p.city === cityFilter)
    )
    const job = jobs.filter(j =>
      (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)) &&
      (!cityFilter || j.city === cityFilter)
    )
    const ann = listings.filter(a =>
      (!q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) &&
      (!cityFilter || a.city === cityFilter)
    )

    return { prod, serv, shop, immo, job, ann }
  }, [query, city])

  const totalResults = filtered.prod.length + filtered.serv.length + filtered.shop.length + filtered.immo.length + filtered.job.length + filtered.ann.length

  return (
    <>
      <div className="bg-white border-b border-[#E8E0D0]/60 sticky top-[104px] z-30">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:max-w-[640px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA99C]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher produits, services, logements, emplois..."
                className="pl-11 h-12 rounded-full bg-[#FFFBEB] border-[#E8E0D0] text-[15px]"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-[#FFFBEB] border border-[#E8E0D0] rounded-full px-4 h-12">
                <MapPin className="h-4 w-4 text-[#0E9F6E]" />
                <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer">
                  <option>Toutes</option>
                  <option>Lomé</option>
                  <option>Sokodé</option>
                  <option>Kara</option>
                  <option>Atakpamé</option>
                  <option>Kpalimé</option>
                  <option>Dapaong</option>
                </select>
              </div>
              <Button variant="outline" className="h-12 rounded-full gap-2" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" /> Filtres
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'all', label: `Tout (${totalResults})` },
              { id: 'produits', label: `Produits (${filtered.prod.length})` },
              { id: 'boutiques', label: `Boutiques (${filtered.shop.length})` },
              { id: 'services', label: `Services (${filtered.serv.length})` },
              { id: 'immobilier', label: `Immobilier (${filtered.immo.length})` },
              { id: 'emploi', label: `Emploi (${filtered.job.length})` },
              { id: 'annonces', label: `Annonces (${filtered.ann.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeTab === tab.id ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]' : 'bg-white border-[#E8E0D0] hover:border-[#0E9F6E] hover:text-[#0E9F6E]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        {showFilters && (
          <div className="bg-white border border-[#E8E0D0] rounded-[16px] p-4 mb-6 grid sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B7B6B]">Prix min (FCFA)</label>
              <Input placeholder="0" className="mt-1 rounded-full" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7B6B]">Prix max (FCFA)</label>
              <Input placeholder="1 000 000" className="mt-1 rounded-full" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7B6B]">Catégorie</label>
              <select className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white">
                <option>Toutes catégories</option>
                <option>Électronique</option>
                <option>Mode</option>
                <option>Maison</option>
                <option>Véhicules</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7B6B]">Tri</label>
              <select className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white">
                <option>Pertinence</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Plus récent</option>
              </select>
            </div>
          </div>
        )}

        {totalResults === 0 ? (
          <div className="text-center py-16 bg-white rounded-[20px] border border-[#E8E0D0]/60">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-semibold text-lg">Aucun résultat pour &quot;{query}&quot;</h3>
            <p className="text-sm text-[#6B7B6B] mt-1">Essayez avec d&apos;autres mots-clés ou changez de ville</p>
            <Button className="mt-4 rounded-full" onClick={() => { setQuery(''); setCity('Toutes') }}>Effacer les filtres</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {(activeTab === 'all' || activeTab === 'produits') && filtered.prod.length > 0 && (
              <section>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">🛍️ Produits <Badge variant="secondary">{filtered.prod.length}</Badge></h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filtered.prod.map(p => (
                    <Link key={p.id} href={`/produits/${p.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] overflow-hidden hover:shadow-md transition-all group">
                      <img src={p.images[0]} alt={p.name} className="h-32 w-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="p-3">
                        <div className="font-medium text-[13px] line-clamp-2 leading-tight">{p.name}</div>
                        <div className="text-xs text-[#6B7B6B] mt-1">{p.city} • {p.shopName}</div>
                        <div className="font-bold text-sm mt-1 text-[#0E9F6E]">{formatPrice(p.price)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'boutiques') && filtered.shop.length > 0 && (
              <section>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">🏪 Boutiques <Badge variant="secondary">{filtered.shop.length}</Badge></h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {filtered.shop.map(s => (
                    <Link key={s.id} href={`/boutiques/${s.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] p-4 flex gap-3 hover:shadow-sm transition-all">
                      <img src={s.logo} alt={s.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-sm">{s.name}</div>
                        <div className="text-xs text-[#6B7B6B]">{s.category} • {s.city}</div>
                        <div className="text-xs mt-1">⭐ {s.rating} • {s.productsCount} produits</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'services') && filtered.serv.length > 0 && (
              <section>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">🔧 Services <Badge variant="secondary">{filtered.serv.length}</Badge></h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.serv.map(s => (
                    <Link key={s.id} href={`/services/${s.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] overflow-hidden hover:shadow-sm transition-all">
                      <div className="h-36 bg-[#F5F1E8]"><img src={s.images[0]} alt={s.title} className="h-full w-full object-cover" /></div>
                      <div className="p-3">
                        <div className="font-semibold text-sm line-clamp-1">{s.title}</div>
                        <div className="text-xs text-[#6B7B6B]">{s.city} • {s.professional.name}</div>
                        <div className="font-bold text-sm mt-1 text-[#0E9F6E]">{formatPrice(s.price)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'immobilier') && filtered.immo.length > 0 && (
              <section>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">🏠 Immobilier <Badge variant="secondary">{filtered.immo.length}</Badge></h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {filtered.immo.map(p => (
                    <Link key={p.id} href={`/immobilier/${p.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] overflow-hidden hover:shadow-sm transition-all">
                      <img src={p.photos[0]} alt={p.title} className="h-40 w-full object-cover" />
                      <div className="p-3">
                        <div className="font-semibold text-sm line-clamp-1">{p.title}</div>
                        <div className="text-xs text-[#6B7B6B]">{p.city} • {p.superficie}m²</div>
                        <div className="font-bold text-sm mt-1 text-[#06B6D4]">{formatPrice(p.price)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'emploi') && filtered.job.length > 0 && (
              <section>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">💼 Emploi <Badge variant="secondary">{filtered.job.length}</Badge></h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {filtered.job.map(j => (
                    <Link key={j.id} href={`/emploi/${j.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] p-4 hover:shadow-sm transition-all">
                      <div className="font-semibold text-sm">{j.title}</div>
                      <div className="text-xs text-[#6B7B6B]">{j.company} • {j.city} • {j.contractType}</div>
                      <div className="text-xs mt-2 font-medium">{j.salary}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'annonces') && filtered.ann.length > 0 && (
              <section>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">📢 Annonces <Badge variant="secondary">{filtered.ann.length}</Badge></h2>
                <div className="grid md:grid-cols-3 gap-3">
                  {filtered.ann.map(a => (
                    <Link key={a.id} href={`/annonces/${a.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] p-3 flex gap-3 hover:shadow-sm transition-all">
                      <img src={a.images[0]} alt={a.title} className="h-16 w-16 rounded-[10px] object-cover" />
                      <div>
                        <div className="font-medium text-sm line-clamp-1">{a.title}</div>
                        <div className="text-xs text-[#6B7B6B]">{a.city} • {a.category}</div>
                        <div className="font-bold text-sm mt-1">{formatPrice(a.price)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default function RecherchePage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <Suspense fallback={<div className="p-8 text-center">Chargement recherche...</div>}>
        <RechercheContent />
      </Suspense>
    </div>
  )
}
