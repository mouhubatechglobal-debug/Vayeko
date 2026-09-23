"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Wrench, Store, DollarSign, Home, Briefcase, GraduationCap } from "lucide-react"

const categoriesBar = [
  { id: 'services', name: 'Services', icon: Wrench, href: '/services' },
  { id: 'boutiques', name: 'Boutiques', icon: Store, href: '/boutiques' },
  { id: 'prix', name: 'Prix', icon: DollarSign, href: '/prix' },
  { id: 'immobilier', name: 'Immobilier', icon: Home, href: '/immobilier' },
  { id: 'emploi', name: 'Emploi', icon: Briefcase, href: '/emploi' },
  { id: 'campus', name: 'Campus', icon: GraduationCap, href: '/campus' },
]

export function CategoriesBar() {
  return (
    <section className="relative -mt-1">
      {/* Motif africain autour zone - multicolore jaune/rouge/vert/bleu/noir géométrique, accent visuel */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[#0A2A12] relative overflow-hidden">
          {/* Motif textile africain subtil */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #FFB800 0px, #FFB800 12px, #E11D48 12px, #E11D48 24px, #0E9F6E 24px, #0E9F6E 36px, #06B6D4 36px, #06B6D4 48px)`,
          }} />
        </div>
      </div>

      {/* Grande section verte foncée formes arrondies */}
      <div className="bg-[#0A2A12] rounded-t-[28px] sm:rounded-t-[32px] mx-2 sm:mx-4 lg:mx-8 -mt-6 relative z-10 border border-[#0A2A12] shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Desktop */}
          <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
            {categoriesBar.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link href={cat.href} className="group flex flex-col items-center gap-3 text-center">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-[68px] sm:w-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all">
                      <cat.icon className="h-7 w-7 text-[#0A2A12]" />
                    </div>
                    {/* Petit accent jaune */}
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#FFB800] border-2 border-white flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0A2A12]" />
                    </div>
                  </div>
                  <div className="font-bold text-[14px] text-white tracking-wide">{cat.name}</div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile - défilement horizontal sans casser page */}
          <div className="sm:hidden flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-2 px-2">
            {categoriesBar.map((cat) => (
              <Link key={cat.id} href={cat.href} className="shrink-0 flex flex-col items-center gap-2 text-center min-w-[72px]">
                <div className="relative">
                  <div className="h-[60px] w-[60px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <cat.icon className="h-6 w-6 text-[#0A2A12]" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#FFB800] border-2 border-white" />
                </div>
                <div className="font-bold text-[12px] text-white">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Formes arrondies bottom */}
        <div className="absolute -bottom-1 left-0 right-0 h-6 bg-[#FFFBEB] rounded-t-[20px] sm:hidden" />
      </div>

      {/* Motif africain bandeau */}
      <div className="h-2 bg-gradient-to-r from-[#FFB800] via-[#E11D48] via-[#0E9F6E] via-[#06B6D4] to-[#7C3AED] mx-2 sm:mx-4 lg:mx-8 opacity-90" />
    </section>
  )
}
