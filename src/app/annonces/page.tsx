import { listings } from "@/lib/data"
import Link from "next/link"
import { MapPin, Search, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatPrice, formatRelativeTime } from "@/lib/utils"

export default function AnnoncesPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-white border-b border-[#E8E0D0]/60">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[28px] font-bold tracking-tight">Petites annonces</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Électronique, véhicules, maison, vêtements, services • Particuliers et pros</p>
          <div className="mt-4 flex gap-2 max-w-[600px]">
            <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA99C]" /><Input placeholder="Moto, canapé, ordinateur..." className="pl-11 rounded-full bg-[#FFFBEB]" /></div>
            <select className="h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Toutes catégories</option><option>Électronique</option><option>Véhicules</option><option>Maison</option></select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.concat(listings).map((ann, idx) => (
            <Link key={`${ann.id}-${idx}`} href={`/annonces/${ann.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[18px] overflow-hidden hover:shadow-md transition-all">
              <div className="h-48 bg-[#F5F1E8] relative overflow-hidden"><img src={ann.images[0]} alt={ann.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /><span className="absolute top-2.5 left-2.5 text-[11px] bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1"><Tag className="h-3 w-3" /> {ann.category}</span></div>
              <div className="p-3.5">
                <h3 className="font-semibold text-[14px] leading-tight line-clamp-2">{ann.title}</h3>
                <p className="text-xs text-[#6B7B6B] mt-1 line-clamp-2 leading-relaxed">{ann.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#6B7B6B]"><MapPin className="h-3 w-3" /> {ann.city} • {ann.quartier} • {formatRelativeTime(ann.createdAt)}</div>
                <div className="mt-3 flex items-center justify-between"><span className="font-bold text-[#1A2E1A]">{formatPrice(ann.price)}</span><span className="text-xs text-[#6B7B6B]">{ann.seller}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
