"use client"

import { useState } from "react"
import { products } from "@/lib/data"
import { formatPrice, formatRelativeTime } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingDown, MapPin, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function ComparateurPage() {
  const [query, setQuery] = useState("Samsung Galaxy A55")
  
  // Group products by name similarity for comparison
  const grouped = [
    {
      name: "Samsung Galaxy A55 128Go",
      category: "Téléphones",
      offers: products.filter(p => p.name.toLowerCase().includes('samsung') || p.name.toLowerCase().includes('galaxy')),
    },
    {
      name: "iPhone 13 128Go",
      category: "Téléphones",
      offers: products.filter(p => p.name.toLowerCase().includes('iphone')),
    },
  ]

  const filteredGroups = grouped.filter(g => !query || g.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-[#1A2E1A] text-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[700px]">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs mb-4"><TrendingDown className="h-3.5 w-3.5" /> Comparateur de prix Vayeko • 100% gratuit</div>
            <h1 className="text-[32px] font-bold leading-tight">Comparez les prix au Togo</h1>
            <p className="text-white/70 mt-2">Trouvez le meilleur prix, vérifiez la date de mise à jour et la disponibilité. Transparence totale, sans commission cachée.</p>
            <div className="mt-6 relative max-w-[560px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un produit à comparer..." className="pl-11 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50" />
              <Button className="absolute right-1 top-1 h-10 rounded-full px-6 bg-white text-[#1A2E1A] hover:bg-[#FFFBEB]">Comparer</Button>
            </div>
            <div className="mt-4 flex gap-2 text-xs text-white/60"><span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Prix vérifiés</span><span>•</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Date visible</span><span>•</span><span>Économie moyenne 8%</span></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8">
        {filteredGroups.map(group => {
          const sorted = [...group.offers].sort((a, b) => a.price - b.price)
          const best = sorted[0]
          const savings = sorted.length > 1 ? sorted[sorted.length - 1].price - best.price : 0
          return (
            <div key={group.name} className="bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden mb-6">
              <div className="p-6 border-b border-[#E8E0D0]/50 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg">{group.name}</h2>
                  <div className="text-xs text-[#6B7B6B] mt-1">{group.category} • {group.offers.length} offres • Meilleur prix {formatPrice(best.price)} • Économie possible {formatPrice(savings)}</div>
                </div>
                <Badge className="bg-[#D1FAE5] text-[#065F46] shrink-0">✓ {group.offers.length} boutiques</Badge>
              </div>
              <div className="divide-y divide-[#F5F1E8]">
                {sorted.map(offer => (
                  <div key={offer.id} className={`p-4 flex items-center gap-4 ${offer.id === best.id ? 'bg-[#D1FAE5]/40' : ''}`}>
                    <img src={offer.images[0]} alt={offer.name} className="h-16 w-16 rounded-[12px] object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">{offer.shopName} {offer.id === best.id && <span className="text-[10px] bg-[#0E9F6E] text-white px-2 py-0.5 rounded-full">Meilleur prix</span>} {offer.stock < 5 && <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full">Plus que {offer.stock}</span>}</div>
                      <div className="text-xs text-[#6B7B6B] flex items-center gap-2 mt-0.5"><MapPin className="h-3 w-3" /> {offer.city} • ⭐ {offer.rating} • <Clock className="h-3 w-3" /> Maj {formatRelativeTime(offer.updatedAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1A2E1A]">{formatPrice(offer.price)}</div>
                      {offer.oldPrice && <div className="text-xs line-through text-[#9CA99C]">{formatPrice(offer.oldPrice)}</div>}
                      <div className="text-[11px] text-[#0E9F6E] mt-0.5">{offer.isAvailable ? 'Disponible' : 'Rupture'}</div>
                    </div>
                    <Link href={`/produits/${offer.id}`}><Button size="sm" variant={offer.id === best.id ? 'default' : 'outline'} className="rounded-full">Voir</Button></Link>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[#FFFBEB] text-[11px] text-[#6B7B6B] text-center">Les prix sont mis à jour par les vendeurs. Vayeko affiche toujours la date de mise à jour. Ne jamais présenter un ancien prix comme prix actuel vérifié.</div>
            </div>
          )
        })}

        {filteredGroups.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[20px] border border-[#E8E0D0]/60">
            <div className="text-4xl mb-3">💰</div>
            <div className="font-semibold">Aucun produit trouvé pour &quot;{query}&quot;</div>
            <div className="text-sm text-[#6B7B6B] mt-1">Essayez &quot;Samsung&quot;, &quot;iPhone&quot;, &quot;Réfrigérateur&quot;</div>
          </div>
        )}
      </div>
    </div>
  )
}
