"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const bigCategories = [
  {
    id: 'services',
    name: 'Services',
    description: 'Artisans, prestataires...',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    color: '#0E9F6E',
    colorLight: '#0E9F6E',
  },
  {
    id: 'boutiques',
    name: 'Boutiques',
    description: 'Magasins, e-commerce...',
    href: '/boutiques',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
    color: '#E11D48',
    colorLight: '#E11D48',
  },
  {
    id: 'prix',
    name: 'Prix',
    description: 'Comparez les prix...',
    href: '/prix',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
    color: '#FFB800',
    colorLight: '#D97706',
  },
  {
    id: 'immobilier',
    name: 'Immobilier',
    description: 'Maisons, appartements...',
    href: '/immobilier',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    color: '#06B6D4',
    colorLight: '#0891B2',
  },
  {
    id: 'emploi',
    name: 'Emploi',
    description: "Offres d'emploi...",
    href: '/emploi',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    color: '#7C3AED',
    colorLight: '#6D28D9',
  },
  {
    id: 'campus',
    name: 'Campus',
    description: 'Étudiants, formations...',
    href: '/campus',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    color: '#0E9F6E',
    colorLight: '#065F46',
  },
]

export function CategoriesGrid() {
  return (
    <section className="py-10 sm:py-12 bg-[#FFFBEB]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A]">Découvre nos catégories</h2>
          <Link href="/recherche" className="text-sm font-bold text-[#0E9F6E] hover:underline hidden sm:flex">Voir tout →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {bigCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <Link href={cat.href} className="block rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all">
                {/* Grande photographie en haut */}
                <div className="relative h-[200px] sm:h-[220px] overflow-hidden bg-[#F5F1E8]">
                  <img src={cat.image} alt={`${cat.name} - Vayeko Togo`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Partie basse couleur forte texte blanc */}
                <div className="p-5 text-white relative" style={{ backgroundColor: cat.color }}>
                  <div className="font-extrabold text-[18px] leading-tight tracking-tight">{cat.name}</div>
                  <div className="text-[13px] mt-1 opacity-90 font-medium leading-tight">{cat.description}</div>
                  {/* Accent décoratif */}
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-white/60" />
                  <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-white/10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link href="/recherche" className="text-sm font-bold text-[#0E9F6E]">Voir tout →</Link>
        </div>
      </div>
    </section>
  )
}
