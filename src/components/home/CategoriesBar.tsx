"use client"

import Link from "next/link"
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
    <section className="bg-[#FFF8E6] px-0">
      {/* Conteneur vert foncé arrondi comme maquette */}
      <div className="bg-[#0E3A23] mx-0 sm:mx-4 lg:mx-8 rounded-t-[24px] sm:rounded-t-[28px] relative overflow-hidden">
        {/* Motif africain bordure haute - exactement comme maquette */}
        <div className="h-[16px] w-full relative overflow-hidden">
          <img src="/images/african-pattern.jpg" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {/* Grille 6 catégories comme maquette */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-2 lg:gap-4 max-w-[800px] mx-auto">
            {categoriesBar.map((cat) => (
              <Link key={cat.id} href={cat.href} className="group flex flex-col items-center gap-2 text-center">
                <div className="relative">
                  <div className="h-[52px] w-[52px] sm:h-[56px] sm:w-[56px] rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform">
                    <cat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#0A2A12]" strokeWidth={2} />
                  </div>
                  {/* Petit point jaune accent comme maquette */}
                  <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#FFB800] border-[2px] border-[#0E3A23]" />
                </div>
                <span className="font-bold text-[11px] sm:text-[12px] text-white tracking-wide">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bordure basse arrondie */}
        <div className="h-3 bg-[#FFF8E6] rounded-t-[16px] sm:hidden" />
      </div>

      {/* Motif africain bandeau bas comme maquette */}
      <div className="h-[14px] mx-0 sm:mx-4 lg:mx-8 relative overflow-hidden -mt-1">
        <img src="/images/african-pattern.jpg" alt="" className="w-full h-full object-cover" />
      </div>
    </section>
  )
}
