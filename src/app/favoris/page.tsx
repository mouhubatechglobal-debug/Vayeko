"use client"

import { useState } from "react"
import { products, properties, listings } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FavorisPage() {
  const [favorites, setFavorites] = useState([
    { type: 'PRODUCT', id: products[0].id, data: products[0] },
    { type: 'PRODUCT', id: products[2].id, data: products[2] },
    { type: 'PROPERTY', id: properties[0].id, data: properties[0] },
    { type: 'LISTING', id: listings[0].id, data: listings[0] },
  ])

  const remove = (id: string) => setFavorites(f => f.filter(x => x.id !== id))

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2"><Heart className="h-7 w-7 text-[#E11D48] fill-[#E11D48]" /> Mes favoris</h1>
            <p className="text-sm text-[#6B7B6B] mt-1">{favorites.length} éléments sauvegardés • Privé • Synchronisé</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => setFavorites([])}>Tout effacer</Button>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-12 text-center py-16 bg-white rounded-[20px] border border-[#E8E0D0]/60">
            <div className="text-5xl mb-3">💚</div>
            <h3 className="font-semibold">Aucun favori pour l&apos;instant</h3>
            <p className="text-sm text-[#6B7B6B] mt-1">Ajoutez des produits, boutiques, services, logements en cliquant sur ♡</p>
            <Link href="/" className="inline-block mt-4"><Button className="rounded-full">Découvrir Vayeko</Button></Link>
          </div>
        ) : (
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(fav => (
              <div key={fav.id} className="bg-white border border-[#E8E0D0]/60 rounded-[18px] overflow-hidden group relative">
                <button onClick={() => remove(fav.id)} className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#FFE4E6] transition-colors"><Trash2 className="h-4 w-4 text-[#E11D48]" /></button>
                <img src={(fav.data as any).images?.[0] || (fav.data as any).photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'} alt="" className="h-40 w-full object-cover" />
                <div className="p-3.5">
                  <div className="text-[11px] bg-[#FFF8E7] border border-[#E8E0D0] px-2 py-0.5 rounded-full w-fit">{fav.type}</div>
                  <div className="font-semibold text-sm mt-2 line-clamp-2">{(fav.data as any).name || (fav.data as any).title}</div>
                  <div className="font-bold text-sm mt-1 text-[#0E9F6E]">{formatPrice((fav.data as any).price || 0)}</div>
                  <Link href={fav.type === 'PRODUCT' ? `/produits/${fav.id}` : fav.type === 'PROPERTY' ? `/immobilier/${fav.id}` : `/annonces/${fav.id}`} className="mt-3 block"><Button size="sm" className="w-full rounded-full">Voir détails</Button></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
