"use client"

import { useState } from "react"
import { Search, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TOGO_CITIES } from "@/lib/utils"
import { motion } from "framer-motion"

export function Hero() {
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("Lomé")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(query)}&ville=${city}`
    }
  }

  return (
    <section className="relative bg-[#FFFBEB] overflow-hidden">
      {/* Hero principal - grande image femme togolaise */}
      <div className="relative mx-auto max-w-[1440px]">
        <div className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] flex">
          {/* Image de fond - jeune femme togolaise vêtement traditionnel coloré, headwrap multicolore, regarde téléphone sourit, décor Togo végétation tropicale palmier */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80"
              alt="Jeune femme togolaise vêtement traditionnel coloré headwrap multicolore regardant téléphone souriant - Vayeko"
              className="w-full h-full object-cover object-top"
            />
            {/* Overlay pour lisibilité texte */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBEB]/95 via-[#FFFBEB]/70 to-transparent lg:via-[#FFFBEB]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBEB]/60 via-transparent to-transparent" />
          </div>

          {/* Contenu gauche - Texte */}
          <div className="relative z-10 w-full lg:w-[52%] px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14 lg:py-20 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-5"
            >
              {/* Titre principal Vayeko très grand typographie manuscrite/organique épaisse */}
              <h1 className="font-extrabold tracking-tight leading-[0.85]">
                <span className="block text-[56px] sm:text-[72px] lg:text-[88px] text-[#0A2A12] font-black" style={{ fontFamily: 'cursive, system-ui', letterSpacing: '-0.03em' }}>
                  Vayeko
                </span>
              </h1>

              {/* Sous-titre Le Togo à portée de main ! sombre/vert fortement visible */}
              <h2 className="text-[24px] sm:text-[30px] lg:text-[32px] font-extrabold leading-[1.1] tracking-tight text-[#0A2A12]">
                Le Togo à portée de
                <br />
                main !
              </h2>

              {/* Petite description courte */}
              <p className="text-[14px] sm:text-[15px] leading-[1.5] text-[#1A2E1A]/80 max-w-[360px] font-medium">
                Services, boutiques, prix, logements, annonces, emploi,
                <br />
                Tout ce qu&apos;il vous faut, ici.
              </p>

              {/* Espace pour barre recherche flottante en desktop */}
              <div className="hidden lg:block h-20" />
            </motion.div>
          </div>

          {/* Badge 100% Togolais circulaire jaune/vert partie droite hero au-dessus image */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 8 }}
            transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 lg:top-16 lg:right-20 z-20"
          >
            <div className="h-[86px] w-[86px] sm:h-[104px] sm:w-[104px] rounded-full bg-[#FFB800] border-[4px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center rotate-[8deg]">
              <div className="h-3 w-3 rounded-full bg-[#0E9F6E] mb-1" />
              <div className="font-black text-[13px] sm:text-[15px] leading-[0.9] text-[#1A2E1A]">100%</div>
              <div className="font-black text-[13px] sm:text-[15px] leading-[0.9] text-[#1A2E1A]">Togolais</div>
              <div className="mt-1 h-1 w-8 bg-[#0E9F6E] rounded-full" />
            </div>
          </motion.div>

          {/* Barre recherche flottante basse hero - grande blanche très arrondie ombre légère flotte au-dessus image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute bottom-6 sm:bottom-8 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-auto lg:w-[560px] z-20"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#E8E0D0]/50 p-1.5 flex items-center gap-1">
              <div className="flex-1 flex items-center gap-2 pl-4 pr-2">
                <Search className="h-5 w-5 text-[#9CA99C] shrink-0" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Que recherchez-vous ?"
                  className="border-0 bg-transparent h-12 text-[15px] font-medium focus-visible:ring-0 focus-visible:border-0 shadow-none px-2 placeholder:text-[#9CA99C]"
                />
              </div>
              
              <div className="hidden sm:flex items-center gap-1 bg-[#F5F1E8] rounded-full px-3 h-11 border border-[#E8E0D0]/50 shrink-0">
                <MapPin className="h-4 w-4 text-[#0E9F6E]" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent text-[14px] font-bold text-[#1A2E1A] focus:outline-none pr-6 cursor-pointer"
                >
                  {TOGO_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-[#6B7B6B] -ml-5 pointer-events-none" />
              </div>

              {/* Bouton jaune avec icône recherche */}
              <Button type="submit" className="h-12 w-12 sm:w-auto sm:px-6 rounded-full bg-[#FFB800] hover:bg-[#E6A600] text-[#1A2E1A] font-bold shadow-sm shrink-0">
                <Search className="h-5 w-5 sm:mr-1" />
                <span className="hidden sm:inline">Rechercher</span>
              </Button>
            </form>

            {/* Mobile localisation */}
            <div className="sm:hidden mt-2 flex justify-center">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 border border-[#E8E0D0]/50 shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-[#0E9F6E]" />
                <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none">
                  {TOGO_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Motif africain décoratif horizontal - accent visuel, pas fond derrière tous textes */}
      <div className="relative h-3 bg-gradient-to-r from-[#FFB800] via-[#E11D48] via-[#0E9F6E] via-[#06B6D4] to-[#7C3AED] opacity-80" />
      <div className="h-1 bg-[#1A2E1A]/10" />
    </section>
  )
}
