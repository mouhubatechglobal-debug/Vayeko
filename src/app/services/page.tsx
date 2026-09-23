import { services } from "@/lib/data"
import Link from "next/link"
import { MapPin, Star, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-white border-b border-[#E8E0D0]/60">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[28px] font-bold tracking-tight">Services & Professionnels</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Trouvez un professionnel vérifié près de vous • Réservation instantanée • Paiement sur place</p>
          <div className="mt-4 flex gap-2 max-w-[600px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA99C]" />
              <Input placeholder="Coiffure, plomberie, photographie..." className="pl-11 rounded-full bg-[#FFFBEB]" />
            </div>
            <select className="h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Toutes villes</option><option>Lomé</option><option>Kara</option><option>Sokodé</option></select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <Link key={s.id} href={`/services/${s.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all">
              <div className="h-48 relative overflow-hidden bg-[#F5F1E8]">
                <img src={s.images[0]} alt={s.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-white/90 backdrop-blur text-[#1A2E1A] text-[11px]">{s.category}</Badge>
                  {s.professional.isOpen ? <Badge className="bg-[#0E9F6E] text-white text-[11px]">Ouvert</Badge> : <Badge variant="secondary" className="text-[11px]">Fermé</Badge>}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex items-center gap-2">
                    <img src={s.professional.logo} alt={s.professional.name} className="h-8 w-8 rounded-full border-2 border-white" />
                    <div className="text-white"><div className="text-xs font-semibold">{s.professional.name}</div><div className="text-[11px] opacity-80 flex items-center gap-1"><Star className="h-3 w-3 fill-white" /> {s.professional.rating} • {s.professional.reviewCount} avis</div></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[15px] leading-tight">{s.title}</h3>
                <p className="text-xs text-[#6B7B6B] mt-1.5 line-clamp-2">{s.description}</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6B7B6B]">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.city} • {s.professional.quartier}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.professional.horaires}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div><div className="text-[11px] text-[#6B7B6B]">{s.priceType}</div><div className="font-bold text-[#0E9F6E]">{formatPrice(s.price)}</div></div>
                  <span className="text-xs font-medium text-[#0E9F6E]">Réserver →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
