"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { properties } from "@/lib/data"
import { MapPin, Bed, Square, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatRelativeTime } from "@/lib/utils"

export function ImmobilierSection() {
  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A] flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#06B6D4]" /> Immobilier
            </h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Maisons, appartements, terrains • Lomé, Kara, Kpalimé</p>
          </div>
          <Link href="/immobilier" className="hidden sm:flex text-sm font-semibold text-[#06B6D4] hover:underline">Voir tout →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((prop, index) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/immobilier/${prop.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all block">
                <div className="h-52 relative overflow-hidden bg-[#F5F1E8]">
                  <img src={prop.photos[0]} alt={prop.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-[#06B6D4] text-white font-bold text-[11px]">{prop.type}</Badge>
                    <Badge variant="secondary" className="bg-white/95 backdrop-blur font-medium text-[11px]">{prop.status}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1 font-medium"><MapPin className="h-3 w-3" /> {prop.city} • {prop.quartier}</span>
                    <span className="bg-white/95 backdrop-blur text-[11px] px-2.5 py-1 rounded-full font-medium">{formatRelativeTime(prop.createdAt)}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[15px] leading-tight group-hover:text-[#06B6D4] transition-colors">{prop.title}</h3>
                  <p className="text-[12px] text-[#6B7B6B] mt-1.5 line-clamp-2 leading-relaxed">{prop.description}</p>
                  <div className="mt-3 flex gap-2">
                    {prop.pieces > 0 && <span className="flex items-center gap-1 bg-[#FFFBEB] px-2.5 py-1 rounded-full text-[11px] font-medium"><Bed className="h-3 w-3" /> {prop.pieces} pièces</span>}
                    <span className="flex items-center gap-1 bg-[#FFFBEB] px-2.5 py-1 rounded-full text-[11px] font-medium"><Square className="h-3 w-3" /> {prop.superficie}m²</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prop.features.slice(0, 3).map(f => (<span key={f} className="text-[10px] bg-[#F5F1E8] px-2 py-1 rounded-full font-medium">{f}</span>))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-extrabold text-[16px] text-[#06B6D4]">{formatPrice(prop.price)} <span className="text-[11px] font-medium text-[#6B7B6B]">{prop.priceType}</span></div>
                    <span className="text-[12px] font-semibold text-[#06B6D4]">Voir →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
