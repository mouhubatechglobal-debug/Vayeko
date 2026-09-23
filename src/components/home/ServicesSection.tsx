import Link from "next/link"
import { services } from "@/lib/data"
import { MapPin, Star, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export function ServicesSection() {
  return (
    <section className="py-8 bg-[#FFFBEB]/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-[#1A2E1A]">Services populaires</h2>
            <p className="text-sm text-[#6B7B6B] mt-0.5">Professionnels vérifiés • Réservation instantanée</p>
          </div>
          <Link href="/services" className="text-sm font-medium text-[#0E9F6E] hover:underline">Tous les services →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-[20px] border border-[#E8E0D0]/60 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group">
              <div className="relative h-[160px] overflow-hidden bg-[#F5F1E8]">
                <img src={service.images[0]} alt={service.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur text-[11px]">{service.category}</Badge>
                  {service.professional.isOpen ? (
                    <Badge variant="success" className="text-[11px]">Ouvert</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">Fermé</Badge>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex items-center gap-2">
                    <img src={service.professional.logo} alt={service.professional.name} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
                    <div className="text-white">
                      <div className="text-xs font-semibold leading-none">{service.professional.name}</div>
                      <div className="text-[11px] opacity-80 flex items-center gap-1"><Star className="h-3 w-3 fill-white" /> {service.professional.rating} • {service.professional.reviewCount} avis</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[14px] leading-tight line-clamp-2 text-[#1A2E1A]">{service.title}</h3>
                <p className="text-xs text-[#6B7B6B] mt-1.5 line-clamp-2 leading-relaxed">{service.description}</p>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-[#6B7B6B]">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {service.city} • {service.professional.quartier}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.professional.horaires}</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#6B7B6B]">{service.priceType}</div>
                    <div className="font-bold text-[#0E9F6E]">{formatPrice(service.price)}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="whatsapp" className="h-8 rounded-full px-3 text-xs gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </Button>
                    <Button size="sm" className="h-8 rounded-full px-3 text-xs">Réserver</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
