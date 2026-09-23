"use client"

import Link from "next/link"
import { Star } from "lucide-react"

const produits = [
  {
    id: 'arachide',
    name: 'Arachide',
    price: 1500,
    rating: 4.8,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&q=80',
    href: '/produits/arachide',
  },
  {
    id: 'pagne-wax',
    name: 'Pagne wax',
    price: 10000,
    rating: 4.9,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1520903926444-326a9c1381d6?w=300&q=80',
    href: '/produits/pagne-wax',
  },
  {
    id: 'tomate',
    name: 'Tomate',
    price: 600,
    rating: 4.6,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&q=80',
    href: '/produits/tomate',
  },
  {
    id: 'mais',
    name: 'Maïs',
    price: 500,
    rating: 4.5,
    reviews: 21,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&q=80',
    href: '/produits/mais',
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-TG').format(price) + ' F CFA'
}

export function ProduitsPopulairesSection() {
  return (
    <section className="py-6 sm:py-8 bg-[#FFF8E6]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#0A2A12] tracking-tight">Produits populaires</h2>
          <Link href="/boutiques" className="text-[12px] font-bold text-[#0E6F4C] hover:underline flex items-center gap-1">
            Voir tout <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {produits.map((p) => (
            <Link key={p.id} href={p.href} className="group block bg-white rounded-[14px] overflow-hidden border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
              <div className="aspect-square overflow-hidden bg-[#FFFBEB]">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-2.5">
                <div className="font-bold text-[13px] text-[#0A2A12] leading-tight">{p.name}</div>
                <div className="text-[11px] font-extrabold text-[#D97706] mt-1">{formatPrice(p.price)}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-[#FFB800] text-[#FFB800]" />
                  <span className="text-[11px] font-bold text-[#0A2A12]">{p.rating}</span>
                  <span className="text-[10px] text-[#6B7B6B]">({p.reviews})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
