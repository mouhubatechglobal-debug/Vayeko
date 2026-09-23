"use client"

import { useParams } from "next/navigation"
import { shops, products } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, MessageCircle, Phone, Clock, Store } from "lucide-react"
import Link from "next/link"

export default function BoutiqueDetail() {
  const params = useParams()
  const id = params.id as string
  const shop = shops.find(s => s.id === id) || shops[0]
  const shopProducts = products.filter(p => p.shopId === shop.id)

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="h-[240px] relative overflow-hidden">
        <img src={shop.cover} alt={shop.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 items-end">
              <img src={shop.logo} alt={shop.name} className="h-20 w-20 rounded-[16px] border-4 border-white object-cover bg-white shadow-lg" />
              <div className="text-white pb-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">{shop.name} {shop.isVerified && <Badge className="bg-[#0E9F6E] text-white">Vérifié</Badge>}</h1>
                <div className="text-sm opacity-90 flex items-center gap-2 mt-1"><MapPin className="h-4 w-4" /> {shop.city} • {shop.quartier} • {shop.category} • ⭐ {shop.rating} ({shop.reviewCount} avis)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <h2 className="font-semibold">À propos</h2>
              <p className="text-sm text-[#6B7B6B] mt-2 leading-relaxed">{shop.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FFFBEB] rounded-[10px] p-3"><div className="text-[#6B7B6B]">Horaires</div><div className="font-medium">{shop.horaires}</div></div>
                <div className="bg-[#FFFBEB] rounded-[10px] p-3"><div className="text-[#6B7B6B]">Produits</div><div className="font-medium">{shop.productsCount} articles</div></div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Store className="h-5 w-5" /> Produits ({shopProducts.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {shopProducts.map(p => (
                  <Link key={p.id} href={`/produits/${p.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] overflow-hidden hover:shadow-md transition-all">
                    <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover" />
                    <div className="p-3">
                      <div className="font-medium text-sm line-clamp-2 leading-tight">{p.name}</div>
                      <div className="font-bold text-sm mt-1 text-[#0E9F6E]">{formatPrice(p.price)}</div>
                      <div className="text-xs text-[#6B7B6B]">{p.stock} en stock</div>
                    </div>
                  </Link>
                ))}
                {shopProducts.length === 0 && (
                  <div className="col-span-3 text-center py-12 bg-white rounded-[16px] border border-dashed border-[#E8E0D0]">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="font-medium">Aucun produit pour l&apos;instant</div>
                    <div className="text-xs text-[#6B7B6B]">Cette boutique ajoute ses produits bientôt</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <h3 className="font-semibold mb-3">Contacter</h3>
              <div className="space-y-2.5">
                <a href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="flex items-center gap-3 p-3 rounded-[12px] bg-[#25D366]/10 hover:bg-[#25D366]/15 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-[#25D366] flex items-center justify-center text-white"><MessageCircle className="h-5 w-5" /></div>
                  <div><div className="font-medium text-sm">WhatsApp</div><div className="text-xs text-[#6B7B6B]">{shop.whatsapp}</div></div>
                </a>
                <a href={`tel:${shop.phone}`} className="flex items-center gap-3 p-3 rounded-[12px] bg-[#FFFBEB] hover:bg-[#FFF8E7] transition-colors">
                  <div className="h-9 w-9 rounded-full bg-[#0E9F6E] flex items-center justify-center text-white"><Phone className="h-5 w-5" /></div>
                  <div><div className="font-medium text-sm">Téléphone</div><div className="text-xs text-[#6B7B6B]">{shop.phone}</div></div>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#F5F1E8]">
                  <div className="h-9 w-9 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center"><Clock className="h-5 w-5" /></div>
                  <div><div className="font-medium text-sm">Horaires</div><div className="text-xs text-[#6B7B6B]">{shop.horaires}</div></div>
                </div>
              </div>
              <Button className="w-full mt-4 rounded-full">Contacter la boutique</Button>
            </div>

            <div className="bg-[#1A2E1A] text-white rounded-[20px] p-5">
              <h3 className="font-semibold">Pourquoi Vayeko ?</h3>
              <ul className="mt-3 space-y-2 text-xs text-[#A8C5A8]">
                <li>✓ Boutique vérifiée par Vayeko</li>
                <li>✓ Prix mis à jour régulièrement</li>
                <li>✓ Contact direct via WhatsApp</li>
                <li>✓ Avis clients authentiques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
