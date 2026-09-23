"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { listings } from "@/lib/data"
import { MapPin, Tag } from "lucide-react"
import { formatPrice, formatRelativeTime } from "@/lib/utils"

export function AnnoncesSection() {
  return (
    <section className="py-10 sm:py-12 bg-[#FFFBEB]/40">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A]">Annonces & Communauté</h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Petites annonces locales • Lecture rapide • Particuliers & pros</p>
          </div>
          <Link href="/annonces" className="hidden sm:flex text-sm font-semibold text-[#F59E0B] hover:underline">Voir tout →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {listings.concat(listings.slice(0, 3)).map((ann, index) => (
            <motion.div
              key={`${ann.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Link href={`/annonces/${ann.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[16px] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#E8E0D0] transition-all block">
                <div className="h-36 bg-[#F5F1E8] relative overflow-hidden">
                  <img src={ann.images[0]} alt={ann.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-2 left-2 text-[10px] bg-white/95 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 font-bold border border-white/50"><Tag className="h-3 w-3" /> {ann.category}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-[13px] leading-tight line-clamp-2 group-hover:text-[#F59E0B] transition-colors">{ann.title}</h3>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#6B7B6B]"><MapPin className="h-3 w-3" /> {ann.city} • {formatRelativeTime(ann.createdAt)}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-extrabold text-[13px] text-[#1A2E1A]">{formatPrice(ann.price)}</span>
                    <span className="text-[10px] text-[#6B7B6B] truncate max-w-[60px]">{ann.seller}</span>
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
