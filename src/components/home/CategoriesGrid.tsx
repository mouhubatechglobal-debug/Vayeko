"use client"

import Link from "next/link"

const categories = [
  {
    id: 'services',
    name: 'Services',
    desc: 'Artisans, prestataires...',
    href: '/services',
    color: '#0E8A5E',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
  },
  {
    id: 'boutiques',
    name: 'Boutiques',
    desc: 'Magasins, e-commerce...',
    href: '/boutiques',
    color: '#E94E4E',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
  },
  {
    id: 'prix',
    name: 'Prix',
    desc: 'Comparez les prix...',
    href: '/prix',
    color: '#FFB800',
    textColor: '#0A2A12',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
  },
  {
    id: 'immobilier',
    name: 'Immobilier',
    desc: 'Maisons, appartements...',
    href: '/immobilier',
    color: '#1A8FA8',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
  },
  {
    id: 'emploi',
    name: 'Emploi',
    desc: 'Offres d\'emploi...',
    href: '/emploi',
    color: '#6B4A8A',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    id: 'campus',
    name: 'Campus',
    desc: 'Étudiants, formations...',
    href: '/campus',
    color: '#0E5C36',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
]

export function CategoriesGrid() {
  return (
    <section className="py-6 sm:py-8 bg-[#FFF8E6]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header comme maquette */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#0A2A12] tracking-tight">Découvre nos catégories</h2>
          <Link href="/categories" className="text-[12px] font-bold text-[#0E6F4C] hover:underline flex items-center gap-1">
            Voir tout <span>→</span>
          </Link>
        </div>

        {/* Grille 2 colonnes mobile comme maquette, 3 desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={cat.href} className="group block rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 bg-white">
              {/* Image haut */}
              <div className="relative h-[110px] sm:h-[130px] overflow-hidden bg-[#F5F1E8]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Bas couleur comme maquette */}
              <div className="p-3 sm:p-3.5 relative" style={{ backgroundColor: cat.color }}>
                {/* Petit motif décoratif comme maquette */}
                <div className="absolute top-2 right-2 flex gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-white/60" />
                  <div className="h-1 w-1 rounded-full bg-[#FFB800]" />
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                </div>
                
                <div className="font-extrabold text-[14px] leading-tight" style={{ color: cat.textColor || 'white' }}>
                  {cat.name}
                </div>
                <div className="text-[11px] leading-tight mt-0.5 opacity-90" style={{ color: cat.textColor ? `${cat.textColor}CC` : 'rgba(255,255,255,0.85)' }}>
                  {cat.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
