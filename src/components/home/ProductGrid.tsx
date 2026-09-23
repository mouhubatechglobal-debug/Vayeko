import Link from "next/link"
import { products } from "@/lib/data"
import { formatPrice, formatRelativeTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductGrid() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-[#1A2E1A]">Produits populaires</h2>
            <p className="text-sm text-[#6B7B6B] mt-0.5">Mise à jour aujourd&apos;hui • Prix vérifiés</p>
          </div>
          <Link href="/boutiques" className="text-sm font-medium text-[#0E9F6E] hover:underline">Voir toutes les boutiques →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="group bg-white border border-[#E8E0D0]/60 rounded-[18px] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#E8E0D0] transition-all card-hover">
              <Link href={`/produits/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-[#FFFBEB]">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  {product.oldPrice && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</Badge>
                  )}
                  {product.stock < 5 && (
                    <Badge variant="warning" className="text-[10px] px-1.5 py-0">Plus que {product.stock}</Badge>
                  )}
                </div>
                <button className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-[#1A2E1A]" />
                </button>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {product.city}
                  </span>
                  <span className="text-[10px] bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-[#FFB800] text-[#FFB800]" /> {product.rating}
                  </span>
                </div>
              </Link>

              <div className="p-3">
                <Link href={`/produits/${product.id}`}>
                  <h3 className="font-medium text-[13px] leading-[1.3] line-clamp-2 text-[#1A2E1A] group-hover:text-[#0E9F6E] transition-colors min-h-[34px]">{product.name}</h3>
                </Link>
                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-[15px] text-[#1A2E1A]">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-[11px] line-through text-[#9CA99C]">{formatPrice(product.oldPrice)}</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] text-[#6B7B6B] truncate">{product.shopName}</span>
                    <span className="text-[10px] text-[#9CA99C]">{formatRelativeTime(product.updatedAt)}</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-1.5">
                  <Button size="sm" className="flex-1 h-8 rounded-full text-xs">Voir</Button>
                  <Button size="sm" variant="whatsapp" className="h-8 w-8 p-0 rounded-full">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
