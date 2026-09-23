"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { categories } from "@/lib/data"

export function Categories() {
  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#1A2E1A]">Explorer par catégorie</h2>
            <p className="text-[13px] text-[#6B7B6B] mt-1 hidden sm:block">Trouvez ce dont vous avez besoin près de vous</p>
          </div>
          <Link href="/recherche" className="text-sm font-semibold text-[#0E9F6E] hover:underline hidden sm:flex items-center gap-1">Voir tout →</Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={`/${cat.id === 'prix' ? 'prix' : cat.id}`}
                className="group relative bg-white border border-[#E8E0D0]/70 rounded-[20px] p-4 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#E8E0D0] transition-all block h-full"
              >
                <div className="h-12 w-12 rounded-[14px] flex items-center justify-center text-[24px] mb-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${cat.color}14`, border: `1px solid ${cat.color}20` }}>
                  {cat.icon}
                </div>
                <div className="font-bold text-[14px] text-[#1A2E1A] leading-tight">{cat.name}</div>
                <div className="text-[11px] text-[#6B7B6B] mt-1 leading-relaxed line-clamp-2">
                  {cat.id === 'services' && 'Coiffure, réparation, transport...'}
                  {cat.id === 'boutiques' && 'Électronique, mode, alimentation'}
                  {cat.id === 'prix' && 'Comparez et économisez'}
                  {cat.id === 'immobilier' && 'Maisons, apparts, terrains'}
                  {cat.id === 'emploi' && 'CDI, CDD, stages'}
                  {cat.id === 'campus' && 'Logements, stages, formations'}
                  {cat.id === 'annonces' && 'Véhicules, maison, occasions'}
                  {cat.id === 'restauration' && 'Plats locaux, livraison'}
                </div>
                <div className="text-[11px] font-semibold mt-2" style={{ color: cat.color }}>{cat.count.toLocaleString('fr-FR')} offres</div>
                <div className="absolute top-3 right-3 h-2 w-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: cat.color }} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile scrollable */}
        <div className="sm:hidden flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.id === 'prix' ? 'prix' : cat.id}`}
              className="group shrink-0 w-[140px] bg-white border border-[#E8E0D0]/70 rounded-[18px] p-3.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
            >
              <div className="h-10 w-10 rounded-[12px] flex items-center justify-center text-[20px] mb-2.5" style={{ backgroundColor: `${cat.color}14` }}>
                {cat.icon}
              </div>
              <div className="font-bold text-[13px] text-[#1A2E1A] leading-tight">{cat.name}</div>
              <div className="text-[11px] text-[#6B7B6B] mt-0.5">{cat.count.toLocaleString('fr-FR')} offres</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
