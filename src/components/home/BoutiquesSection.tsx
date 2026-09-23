"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { shops } from "@/lib/data"
import { MapPin, Star, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BoutiquesSection() {
  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A]">Boutiques locales</h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Commerçants vérifiés • Produits neufs et garantis • Lomé à Dapaong</p>
          </div>
          <Link href="/boutiques" className="hidden sm:flex text-sm font-semibold text-[#7C3AED] hover:underline">Toutes les boutiques →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/boutiques/${shop.slug || shop.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all block">
                <div className="h-28 bg-[#FFFBEB] relative overflow-hidden">
                  <img src={shop.cover} alt={shop.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {shop.isVerified && <Badge variant="success" className="text-[11px] font-bold">Vérifié</Badge>}
                    <Badge variant="secondary" className="bg-white/95 backdrop-blur text-[11px] font-medium">{shop.category}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-3">
                    <img src={shop.logo} alt={shop.name} className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-sm -mt-8 bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[14px] leading-tight group-hover:text-[#7C3AED] transition-colors">{shop.name}</div>
                      <div className="text-[11px] text-[#6B7B6B] flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {shop.city} • {shop.quartier}</div>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#6B7B6B] mt-3 line-clamp-2 leading-relaxed">{shop.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 font-medium"><Star className="h-3.5 w-3.5 fill-[#FFB800] text-[#FFB800]" /> {shop.rating}</span>
                      <span className="flex items-center gap-1 text-[#6B7B6B]"><Store className="h-3.5 w-3.5" /> {shop.productsCount} produits</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#7C3AED]">Voir →</span>
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
