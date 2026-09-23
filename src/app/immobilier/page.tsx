import { properties } from "@/lib/data"
import Link from "next/link"
import { MapPin, Bed, Square, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatRelativeTime } from "@/lib/utils"

export default function ImmobilierPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-white border-b border-[#E8E0D0]/60">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[28px] font-bold tracking-tight">Immobilier au Togo</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Maisons, appartements, terrains, bureaux • Lomé, Kara, Kpalimé...</p>
          <div className="mt-4 grid sm:grid-cols-5 gap-2 max-w-[800px]">
            <select className="h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Toutes villes</option><option>Lomé</option><option>Kara</option><option>Kpalimé</option></select>
            <select className="h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Tous types</option><option>Maison</option><option>Appartement</option><option>Terrain</option></select>
            <select className="h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>À louer / À vendre</option><option>À louer</option><option>À vendre</option></select>
            <Input placeholder="Prix max" className="rounded-full bg-[#FFFBEB]" />
            <button className="h-11 rounded-full bg-[#06B6D4] text-white text-sm font-medium px-4">Filtrer</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map(p => (
            <Link key={p.id} href={`/immobilier/${p.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all">
              <div className="h-56 relative overflow-hidden bg-[#F5F1E8]">
                <img src={p.photos[0]} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-[#06B6D4] text-white">{p.type}</Badge>
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur">{p.status}</Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.city} • {p.quartier}</span>
                  <span className="bg-white/90 backdrop-blur text-xs px-2.5 py-1 rounded-full">{formatRelativeTime(p.createdAt)}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[16px] leading-tight">{p.title}</h3>
                <p className="text-xs text-[#6B7B6B] mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="mt-3 flex gap-3 text-xs text-[#6B7B6B]">
                  {p.pieces > 0 && <span className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-full"><Bed className="h-3 w-3" /> {p.pieces} pièces</span>}
                  <span className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-full"><Square className="h-3 w-3" /> {p.superficie}m²</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.features.slice(0, 3).map(f => (<span key={f} className="text-[11px] bg-[#F5F1E8] px-2 py-0.5 rounded-full">{f}</span>))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-bold text-lg text-[#06B6D4]">{formatPrice(p.price)} <span className="text-xs font-normal text-[#6B7B6B]">{p.priceType}</span></div>
                  <span className="text-xs font-medium text-[#06B6D4]">Voir détails →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
