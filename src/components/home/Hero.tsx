"use client"

import { useState } from "react"
import { Search, MapPin, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <section className="relative overflow-hidden bg-[#FFFBEB] african-pattern">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-[#0E9F6E]/10 blur-2xl" />
      <div className="absolute top-20 right-20 h-40 w-40 rounded-full bg-[#FFB800]/15 blur-2xl" />
      <div className="absolute bottom-10 left-1/3 h-24 w-24 rounded-full bg-[#06B6D4]/10 blur-2xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E8E0D0] rounded-full px-3.5 py-1.5 text-xs font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0E9F6E] animate-pulse" />
              <span className="text-[#1A2E1A]">+2 103 nouvelles annonces aujourd&apos;hui</span>
              <Sparkles className="h-3.5 w-3.5 text-[#FFB800]" />
            </div>

            <div className="space-y-4">
              <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-[0.95] tracking-tight text-[#1A2E1A]">
                Le Togo
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#0E9F6E] to-[#065F46] bg-clip-text text-transparent">à portée</span>
                  <div className="absolute bottom-1 left-0 right-0 h-3 bg-[#D1FAE5] -rotate-1 -z-0" />
                </span>
                <br />
                de main.
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#6B7B6B] max-w-[520px]">
                Recherchez, comparez et contactez. Produits, services, logements, emplois et annonces locales au Togo. Sans commission cachée.
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-[560px]">
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-[20px] sm:rounded-full border border-[#E8E0D0] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-[#9CA99C]" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Que cherchez-vous ? ex: iPhone, coiffeur, appartement..."
                    className="pl-11 border-0 bg-transparent h-12 text-[15px] focus-visible:ring-0 focus-visible:border-0 shadow-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center bg-[#FFFBEB] rounded-full px-3 h-12 border border-[#E8E0D0]/50">
                    <MapPin className="h-4 w-4 text-[#0E9F6E] mr-1.5" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-transparent text-sm font-medium text-[#1A2E1A] focus:outline-none pr-6 cursor-pointer"
                    >
                      {TOGO_CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-7 rounded-full shrink-0">
                    Rechercher
                  </Button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="text-[#9CA99C]">Populaire :</span>
                {['Samsung', 'Coiffure', 'Appartement Lomé', 'Emploi Kara', 'Moto'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#E8E0D0] hover:border-[#0E9F6E] hover:text-[#0E9F6E] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2 max-w-[420px]">
              <div>
                <div className="text-[22px] font-bold text-[#1A2E1A]">8 500+</div>
                <div className="text-xs text-[#6B7B6B]">Produits & services</div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-[#1A2E1A]">1 200+</div>
                <div className="text-xs text-[#6B7B6B]">Vendeurs vérifiés</div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-[#1A2E1A]">6 villes</div>
                <div className="text-xs text-[#6B7B6B]">Lomé à Dapaong</div>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative lg:h-[520px] hidden lg:block">
            {/* Main card stack */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[380px] h-[460px]">
                {/* Card 1 - Product */}
                <div className="absolute top-0 left-0 w-[240px] bg-white rounded-[20px] border border-[#E8E0D0] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rotate-[-6deg] animate-float">
                  <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300" className="w-full h-[160px] object-cover rounded-[12px] mb-3" alt="" />
                  <div className="font-semibold text-sm">Samsung Galaxy A55</div>
                  <div className="text-xs text-[#6B7B6B]">TechPlus Lomé • Bè</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-[#0E9F6E]">185 000 FCFA</span>
                    <span className="text-[11px] bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full">Neuf</span>
                  </div>
                </div>

                {/* Card 2 - Service */}
                <div className="absolute top-20 right-0 w-[200px] bg-white rounded-[20px] border border-[#E8E0D0] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rotate-[4deg] animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=100" className="h-10 w-10 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-semibold text-xs">Salon Élégance</div>
                      <div className="text-[11px] text-[#6B7B6B]">⭐ 4.8 • Tokoin</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium">Coiffure Homme & Femme</div>
                  <div className="mt-2 flex gap-1.5">
                    <span className="text-[10px] bg-[#25D366] text-white px-2.5 py-1 rounded-full">WhatsApp</span>
                    <span className="text-[10px] bg-[#FFF8E7] border border-[#E8E0D0] px-2.5 py-1 rounded-full">Réserver</span>
                  </div>
                </div>

                {/* Card 3 - Immobilier */}
                <div className="absolute bottom-16 left-4 w-[220px] bg-white rounded-[20px] border border-[#E8E0D0] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rotate-[-2deg] animate-float" style={{ animationDelay: '1s' }}>
                  <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300" className="w-full h-[110px] object-cover rounded-[12px] mb-2" alt="" />
                  <div className="font-semibold text-xs">Appartement 3 pièces - Cité OUA</div>
                  <div className="text-[11px] text-[#6B7B6B] flex items-center gap-1"><MapPin className="h-3 w-3" /> Lomé • 85m²</div>
                  <div className="mt-1.5 font-bold text-sm text-[#06B6D4]">120 000 FCFA/mois</div>
                </div>

                {/* Card 4 - Price comparison */}
                <div className="absolute bottom-0 right-8 w-[180px] bg-[#1A2E1A] rounded-[16px] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.2)] rotate-[3deg] text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#86EFAC] mb-2"><TrendingUp className="h-3.5 w-3.5" /> Comparateur</div>
                  <div className="text-xs font-medium">Galaxy A55</div>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-[11px]"><span className="text-white/60">TechPlus Lomé</span><span className="font-bold">185k</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-white/60">Kara Électro</span><span className="font-bold">195k</span></div>
                    <div className="h-px bg-white/10 my-1" />
                    <div className="text-[10px] text-[#86EFAC]">Économie 10 000 FCFA à Lomé</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
