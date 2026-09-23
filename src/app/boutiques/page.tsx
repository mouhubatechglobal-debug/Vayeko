import { shops, products } from "@/lib/data"
import Link from "next/link"
import { MapPin, Star, Store, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function BoutiquesPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-white border-b border-[#E8E0D0]/60">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[28px] font-bold tracking-tight">Boutiques au Togo</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">{shops.length} boutiques vérifiées • Lomé à Dapaong • Produits neufs et garantis</p>
          <div className="mt-4 max-w-[480px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA99C]" />
            <Input placeholder="Rechercher une boutique..." className="pl-11 rounded-full bg-[#FFFBEB]" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map(shop => (
            <Link key={shop.id} href={`/boutiques/${shop.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all">
              <div className="h-32 bg-[#FFFBEB] relative overflow-hidden">
                <img src={shop.cover} alt={shop.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {shop.isVerified && <Badge variant="success" className="text-[11px]">Vérifié</Badge>}
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur text-[11px]">{shop.category}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-3">
                  <img src={shop.logo} alt={shop.name} className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm -mt-8 bg-white" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[15px] leading-tight">{shop.name}</div>
                    <div className="text-xs text-[#6B7B6B] flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {shop.city} • {shop.quartier}</div>
                  </div>
                </div>
                <p className="text-xs text-[#6B7B6B] mt-3 line-clamp-2 leading-relaxed">{shop.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[#FFB800] text-[#FFB800]" /> {shop.rating} ({shop.reviewCount})</span>
                    <span className="flex items-center gap-1"><Store className="h-3.5 w-3.5" /> {shop.productsCount} produits</span>
                  </div>
                  <span className="text-xs font-medium text-[#0E9F6E]">Voir boutique →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
