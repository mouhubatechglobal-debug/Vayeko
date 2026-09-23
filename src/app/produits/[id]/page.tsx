"use client"

import { useParams } from "next/navigation"
import { products, shops, reviews } from "@/lib/data"
import { formatPrice, formatRelativeTime, generateWhatsAppLink } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Star, Heart, MessageCircle, ShoppingBag, Store, Clock, ShieldCheck, Truck, Package } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const product = products.find(p => p.id === id) || products[0]
  const shop = shops.find(s => s.id === product.shopId) || shops[0]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const whatsappMessage = `Bonjour, je suis intéressé par ${product.name} à ${formatPrice(product.price)} sur Vayeko. Est-ce disponible ?`
  const whatsappLink = generateWhatsAppLink(shop.whatsapp, whatsappMessage)

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs text-[#6B7B6B] mb-4">
          <Link href="/" className="hover:text-[#0E9F6E]">Accueil</Link>
          <span>/</span>
          <Link href="/boutiques" className="hover:text-[#0E9F6E]">Boutiques</Link>
          <span>/</span>
          <span className="text-[#1A2E1A] font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden">
              <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`h-20 w-20 rounded-[12px] overflow-hidden border-2 shrink-0 ${selectedImage === i ? 'border-[#0E9F6E]' : 'border-transparent'}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Shop card */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <img src={shop.logo} alt={shop.name} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">{shop.name} {shop.isVerified && <Badge variant="success" className="text-[10px]">Vérifié</Badge>}</div>
                  <div className="text-xs text-[#6B7B6B] flex items-center gap-2"><MapPin className="h-3 w-3" /> {shop.city} • {shop.quartier} • ⭐ {shop.rating} ({shop.reviewCount})</div>
                </div>
                <Link href={`/boutiques/${shop.id}`}><Button variant="outline" size="sm" className="rounded-full">Visiter</Button></Link>
              </div>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-[24px] font-bold leading-tight tracking-tight">{product.name}</h1>
                <Button variant="outline" size="icon" className="rounded-full shrink-0"><Heart className="h-4 w-4" /></Button>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" /> {product.rating} ({product.reviewCount} avis)</span>
                <span className="text-[#E8E0D0]">•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {product.city}</span>
                <span className="text-[#E8E0D0]">•</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Maj {formatRelativeTime(product.updatedAt)}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-[28px] font-bold tracking-tight">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-sm line-through text-[#9CA99C]">{formatPrice(product.oldPrice)}</span>}
                {product.oldPrice && <Badge variant="destructive" className="ml-2">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</Badge>}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-[#065F46] bg-[#D1FAE5] rounded-full px-3 py-1.5 w-fit text-xs font-medium">
                  <div className="h-2 w-2 bg-[#0E9F6E] rounded-full animate-pulse" /> En stock • {product.stock} disponibles • Livraison {product.delivery ? 'possible' : 'non'} • Retrait {product.pickup ? 'possible' : 'non'}
                </div>

                {product.variants.length > 0 && (
                  <div>
                    <div className="font-medium text-xs mb-2">Variantes</div>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.map(v => (
                        <button key={v} className="px-3 py-1.5 rounded-full border border-[#E8E0D0] text-xs hover:border-[#0E9F6E] hover:text-[#0E9F6E]">{v}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-[#6B7B6B]">Quantité</span>
                  <div className="flex items-center border border-[#E8E0D0] rounded-full">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-8 w-8 flex items-center justify-center hover:bg-[#FFFBEB] rounded-full">-</button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-[#FFFBEB] rounded-full">+</button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" className="w-full rounded-full gap-2 h-12"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
                </a>
                <Button className="w-full rounded-full gap-2 h-12"><ShoppingBag className="h-4 w-4" /> Commander</Button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-[#6B7B6B]">
                <div className="flex items-center gap-1.5 bg-[#FFFBEB] rounded-full px-2.5 py-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#0E9F6E]" /> Paiement sécurisé</div>
                <div className="flex items-center gap-1.5 bg-[#FFFBEB] rounded-full px-2.5 py-1.5"><Truck className="h-3.5 w-3.5 text-[#06B6D4]" /> Livraison rapide</div>
                <div className="flex items-center gap-1.5 bg-[#FFFBEB] rounded-full px-2.5 py-1.5"><Package className="h-3.5 w-3.5 text-[#7C3AED]" /> Retour possible</div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-sm text-[#6B7B6B] leading-relaxed">{product.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#FFFBEB] rounded-[10px] p-3"><div className="text-[#6B7B6B]">Catégorie</div><div className="font-medium">{product.category}</div></div>
                <div className="bg-[#FFFBEB] rounded-[10px] p-3"><div className="text-[#6B7B6B]">Ville</div><div className="font-medium">{product.city}</div></div>
                <div className="bg-[#FFFBEB] rounded-[10px] p-3"><div className="text-[#6B7B6B]">Boutique</div><div className="font-medium">{product.shopName}</div></div>
                <div className="bg-[#FFFBEB] rounded-[10px] p-3"><div className="text-[#6B7B6B]">Mise à jour</div><div className="font-medium">{formatRelativeTime(product.updatedAt)}</div></div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <h3 className="font-semibold mb-3">Avis clients ({product.reviewCount})</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex"><Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" /><Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" /><Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" /><Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" /><Star className="h-4 w-4 fill-[#E8E0D0] text-[#E8E0D0]" /></div>
                  <div className="text-xs text-[#6B7B6B]">Basé sur {product.reviewCount} avis</div>
                </div>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, 2).map(r => (
                  <div key={r.id} className="border-b border-[#F5F1E8] last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-2"><img src={r.avatar} alt={r.userName} className="h-7 w-7 rounded-full" /><span className="font-medium text-sm">{r.userName}</span><span className="text-xs text-[#6B7B6B]">• {formatRelativeTime(r.createdAt)}</span></div>
                    <div className="mt-1 text-sm text-[#1A2E1A]">{r.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-bold text-lg mb-4">Produits similaires • Comparaison</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/produits/${p.id}`} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] overflow-hidden hover:shadow-md transition-all">
                  <img src={p.images[0]} alt={p.name} className="h-36 w-full object-cover" />
                  <div className="p-3">
                    <div className="font-medium text-sm line-clamp-2">{p.name}</div>
                    <div className="font-bold text-sm mt-1 text-[#0E9F6E]">{formatPrice(p.price)}</div>
                    <div className="text-xs text-[#6B7B6B]">{p.city}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
