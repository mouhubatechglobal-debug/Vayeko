"use client"

import { useState } from "react"
import { Search, MapPin, ChevronDown } from "lucide-react"
import { TOGO_CITIES } from "@/lib/utils"

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
    <section className="relative bg-[#FFF8E6] overflow-hidden">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Hero Image Container - exactement comme maquette */}
        <div className="relative h-[460px] sm:h-[500px] lg:h-[520px] overflow-hidden">
          {/* Image de fond - femme togolaise */}
          <img
            src="/images/hero-vayeko.jpg"
            alt="Jeune femme togolaise vêtement traditionnel coloré headwrap multicolore téléphone sourit - Vayeko Le Togo à portée de main"
            className="absolute inset-0 w-full h-full object-cover object-[50%_20%]"
          />
          
          {/* Overlay gradient jaune à gauche comme maquette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFC94A] via-[#FFC94A]/60 via-35% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8E6] via-[#FFF8E6]/70 via-30% to-transparent sm:via-25%" />

          {/* Contenu texte gauche */}
          <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 lg:px-12 pt-4 pb-20">
            <div className="max-w-[320px]">
              {/* Titre Vayeko très grand manuscrit comme maquette */}
              <h1 className="font-black leading-[0.85] tracking-tight">
                <span className="block text-[52px] sm:text-[62px] lg:text-[68px] text-[#0A2A12] -rotate-1 origin-left" style={{ fontFamily: 'cursive', fontWeight: 900 }}>
                  Vayeko
                </span>
              </h1>
              
              {/* Sous-titre */}
              <h2 className="mt-1 text-[18px] sm:text-[20px] font-bold leading-[1.1] text-[#0A2A12] italic">
                Le Togo à portée de main !
              </h2>

              {/* Description */}
              <p className="mt-3 text-[11px] leading-[1.5] text-[#1A2E1A]/80 font-medium max-w-[250px]">
                Services, boutiques, prix, logements, annonces, emploi. Tout ce qu&apos;il vous faut, ici.
              </p>
            </div>
          </div>

          {/* Badge 100% Togolais */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 lg:right-16 z-20">
            <div className="h-[62px] w-[62px] sm:h-[68px] sm:w-[68px] rounded-full bg-[#FFB800] border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center rotate-[10deg]">
              <span className="font-black text-[12px] leading-[0.9] text-[#0A2A12]">100%</span>
              <span className="font-black text-[10px] leading-[0.9] text-[#0A2A12]">Togolais</span>
            </div>
          </div>

          {/* Barre recherche */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-auto z-20">
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-black/5 p-1 flex items-center gap-1 max-w-[520px]">
              <div className="flex-1 flex items-center gap-2 pl-3 pr-2">
                <div className="h-7 w-7 rounded-full bg-[#FFF3C4] flex items-center justify-center shrink-0">
                  <Search className="h-3.5 w-3.5 text-[#D99A00]" strokeWidth={2.5} />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Que recherchez-vous ?"
                  className="flex-1 bg-transparent h-10 text-[13px] font-medium placeholder:text-[#9CA99C] focus:outline-none"
                />
              </div>
              
              <div className="hidden sm:flex items-center gap-1.5 bg-[#FFF8E6] rounded-full px-3 h-9 border border-black/5 shrink-0">
                <MapPin className="h-3.5 w-3.5 text-[#0E6F4C]" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-[#0A2A12] focus:outline-none pr-4 cursor-pointer appearance-none"
                >
                  {TOGO_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-[#6B7B6B] -ml-3.5 pointer-events-none" />
              </div>

              <button type="submit" className="h-10 w-10 rounded-full bg-[#FFB800] hover:bg-[#E6A600] flex items-center justify-center shadow-sm shrink-0 transition-colors">
                <Search className="h-4 w-4 text-[#0A2A12]" strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Motif africain bordure */}
      <div className="relative h-[16px] w-full overflow-hidden">
        <img src="/images/african-pattern.jpg" alt="" className="w-full h-full object-cover object-center" />
      </div>
    </section>
  )
}
