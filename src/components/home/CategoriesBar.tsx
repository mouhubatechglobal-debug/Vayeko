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
      {/* Barre verte */}
      <div className="bg-[#0E3A23] mx-0 sm:mx-3 lg:mx-6 rounded-[20px] sm:rounded-[24px] relative overflow-hidden border border-[#0E3A23] shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <div className="px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-3 max-w-[720px] mx-auto">
            {categoriesBar.map((cat) => (
              <Link key={cat.id} href={cat.href} className="group flex flex-col items-center gap-2 text-center">
                <div className="relative">
                  <div className="h-[50px] w-[50px] sm:h-[54px] sm:w-[54px] rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all">
                    <cat.icon className="h-5 w-5 text-[#0A2A12]" strokeWidth={2} />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 h-[14px] w-[14px] rounded-full bg-[#FFB800] border-2 border-[#0E3A23] flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-[#0A2A12]" />
                  </div>
                </div>
                <span className="font-bold text-[11px] text-white tracking-wide">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Motif africain bandeau 0,3cm */}
      <div className="h-[0.3cm] mx-0 sm:mx-3 lg:mx-6 -mt-1 relative overflow-hidden">
        <img src="/images/african-bandeau-03cm.png" alt="Motif africain 0,3cm" className="w-full h-full object-cover object-center" />
      </div>
    </section>
  )
}
