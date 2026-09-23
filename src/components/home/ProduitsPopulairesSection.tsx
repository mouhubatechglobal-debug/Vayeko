"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const produitsPopulaires = [
  { id: 'arachide', name: 'Arachide', price: 1500, rating: 4.8, reviews: 32, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80', category: 'Alimentation' },
  { id: 'pagne_wax', name: 'Pagne Wax', price: 10000, rating: 4.9, reviews: 54, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80', category: 'Mode' },
  { id: 'tomate', name: 'Tomate', price: 600, rating: 4.6, reviews: 87, image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&q=80', category: 'Alimentation' },
  { id: 'mais', name: 'Maïs', price: 500, rating: 4.5, reviews: 21, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', category: 'Alimentation' },
  { id: 'huile_palme', name: 'Huile de palme 5L', price: 6500, rating: 4.9, reviews: 34, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', category: 'Alimentation' },
  { id: 'samsung_a55', name: 'Samsung Galaxy A55', price: 185000, rating: 4.8, reviews: 56, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80', category: 'Électronique' },
]

export function ProduitsPopulairesSection() {
  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A]">Produits populaires</h2>
          <Link href="/boutiques" className="text-sm font-bold text-[#0E9F6E] hover:underline hidden sm:flex">Voir tout →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {produitsPopulaires.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/produits/${product.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[18px] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all block">
                <div className="relative h-36 sm:h-40 bg-[#FFFBEB] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-3">
                  <div className="font-bold text-[13px] leading-tight text-[#1A2E1A] group-hover:text-[#0E9F6E] transition-colors">{product.name}</div>
                  <div className="mt-1.5 font-extrabold text-[14px] text-[#D97706]">{formatPrice(product.price)}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6B7B6B]">
                    <Star className="h-3 w-3 fill-[#FFB800] text-[#FFB800]" /> {product.rating} ({product.reviews})
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link href="/boutiques" className="text-sm font-bold text-[#0E9F6E]">Voir tout →</Link>
        </div>

        <div className="mt-4 text-[11px] text-[#9CA99C] text-center">Données de démonstration visuelles — dans l&apos;app réelle, infos viennent de la base de données Supabase</div>
      </div>
    </section>
  )
}
