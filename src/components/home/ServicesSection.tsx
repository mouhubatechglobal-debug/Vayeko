"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { services } from "@/lib/data"
import { MapPin, Star, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export function ServicesSection() {
  return (
    <section className="py-10 sm:py-12 bg-[#FFFBEB]/40">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A]">Services près de vous</h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Professionnels vérifiés • Réservation instantanée • WhatsApp direct</p>
          </div>
          <Link href="/services" className="hidden sm:flex text-sm font-semibold text-[#0E9F6E] hover:underline items-center gap-1">Tous les services →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[20px] border border-[#E8E0D0]/60 overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all group"
            >
              <div className="relative h-[170px] overflow-hidden bg-[#F5F1E8]">
                <img src={service.images[0]} alt={service.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white/95 backdrop-blur text-[11px] font-semibold border border-white/50">{service.category}</Badge>
                  {service.professional.isOpen ? (
                    <Badge variant="success" className="text-[11px] font-bold">Ouvert</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">Fermé</Badge>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-8">
                  <div className="flex items-center gap-2.5">
                    <img src={service.professional.logo} alt={service.professional.name} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" />
                    <div className="text-white">
                      <div className="text-[13px] font-bold leading-none">{service.professional.name}</div>
                      <div className="text-[11px] opacity-90 flex items-center gap-1 mt-0.5"><Star className="h-3 w-3 fill-white" /> {service.professional.rating} • {service.professional.reviewCount} avis • {service.city}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-[14px] leading-[1.3] line-clamp-2 text-[#1A2E1A] group-hover:text-[#0E9F6E] transition-colors">{service.title}</h3>
                <p className="text-[12px] text-[#6B7B6B] mt-1.5 line-clamp-2 leading-relaxed">{service.description}</p>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6B7B6B]">
                  <span className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-full"><MapPin className="h-3 w-3" /> {service.professional.quartier}</span>
                  <span className="flex items-center gap-1 bg-[#F5F1E8] px-2 py-1 rounded-full"><Clock className="h-3 w-3" /> {service.professional.horaires}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#6B7B6B] font-medium">{service.priceType}</div>
                    <div className="font-extrabold text-[15px] text-[#0E9F6E]">{formatPrice(service.price)}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="whatsapp" className="h-8 rounded-full px-3 text-xs gap-1 font-bold shadow-sm">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </Button>
                    <Button size="sm" className="h-8 rounded-full px-3 text-xs font-semibold">Réserver</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link href="/services" className="text-sm font-semibold text-[#0E9F6E]">Voir tous les services →</Link>
        </div>
      </div>
    </section>
  )
}
