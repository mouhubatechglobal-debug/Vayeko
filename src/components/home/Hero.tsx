"use client"

import { useState } from "react"
import { Search, MapPin, Sparkles, TrendingUp, CheckCircle } from "lucide-react"
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
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background */}
      <div className="absolute inset-0 african-pattern" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0E9F6E]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB800]/8 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-6 items-center py-8 sm:py-12 lg:py-16">
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-[#E8E0D0] rounded-full px-3.5 py-1.5 text-xs font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0E9F6E] animate-pulse" />
              <span className="text-[#1A2E1A]">+2 103 nouvelles annonces aujourd&apos;hui</span>
              <Sparkles className="h-3.5 w-3.5 text-[#FFB800]" />
            </div>

            <div className="space-y-4">
              <h1 className="text-[34px] sm:text-[48px] lg:text-[58px] font-extrabold leading-[0.9] tracking-[-0.02em] text-[#1A2E1A]">
                Le Togo
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[#0E9F6E] to-[#065F46] bg-clip-text text-transparent">à portée</span>
                  <div className="absolute bottom-1.5 left-0 right-0 h-3 bg-[#D1FAE5] -rotate-1 -z-0" />
                </span>
                <br />
                de main.
              </h1>
              <p className="text-[16px] sm:text-[18px] leading-[1.5] text-[#6B7B6B] max-w-[480px] font-medium">
                Découvrez les services, boutiques, produits, logements, emplois et opportunités près de vous.
              </p>
            </div>

            {/* Search - Element central Vayeko */}
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSearch} 
              className="relative max-w-[560px]"
            >
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-[24px] sm:rounded-full border border-[#E8E0D0] shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-[#9CA99C]" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Que recherchez-vous ?"
                    className="pl-11 border-0 bg-transparent h-[52px] text-[16px] focus-visible:ring-0 focus-visible:border-0 shadow-none font-medium"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center bg-[#FFFBEB] rounded-full px-4 h-[52px] border border-[#E8E0D0]/60 shrink-0">
                    <MapPin className="h-4 w-4 text-[#0E9F6E] mr-2" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-transparent text-[14px] font-semibold text-[#1A2E1A] focus:outline-none pr-6 cursor-pointer"
                    >
                      {TOGO_CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" size="lg" className="h-[52px] px-8 rounded-full shrink-0 text-[15px] font-bold shadow-sm">
                    Rechercher
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="text-[#9CA99C] font-medium">Populaire :</span>
                {['Samsung', 'Coiffure', 'Appartement Lomé', 'Emploi Kara', 'Moto'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E8E0D0] hover:border-[#0E9F6E] hover:text-[#0E9F6E] transition-colors font-medium text-[#6B7B6B] hover:bg-[#FFFBEB]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* Stats - Preuve sociale */}
            <div className="grid grid-cols-3 gap-6 pt-2 max-w-[420px] border-t border-[#F5F1E8] mt-2">
              <div>
                <div className="text-[24px] font-bold text-[#1A2E1A] tracking-tight">8 500+</div>
                <div className="text-[12px] text-[#6B7B6B] font-medium">Produits & services</div>
              </div>
              <div>
                <div className="text-[24px] font-bold text-[#1A2E1A] tracking-tight">1 200+</div>
                <div className="text-[12px] text-[#6B7B6B] font-medium">Vendeurs vérifiés</div>
              </div>
              <div>
                <div className="text-[24px] font-bold text-[#1A2E1A] tracking-tight">6 villes</div>
                <div className="text-[12px] text-[#6B7B6B] font-medium">Lomé à Dapaong</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Image locale forte */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative lg:h-[580px] hidden lg:block"
          >
            {/* Image principale - Contexte togolais/local */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-[480px] h-[520px]">
                {/* Image de fond - Personne utilisant téléphone, vie locale */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                  <img 
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80" 
                    alt="Jeune femme togolaise utilisant son téléphone au marché de Lomé - Vayeko"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay chaleureux */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0E9F6E]/10 via-transparent to-[#FFB800]/10" />
                </div>

                {/* Floating Card - Produit */}
                <motion.div 
                  initial={{ y: 20, opacity: 0, rotate: -6 }}
                  animate={{ y: 0, opacity: 1, rotate: -4 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="absolute -top-2 -left-6 w-[220px] bg-white rounded-[20px] border border-[#E8E0D0] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                >
                  <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300" className="w-full h-[130px] object-cover rounded-[14px] mb-3" alt="Samsung Galaxy" />
                  <div className="font-bold text-[13px] leading-tight">Samsung Galaxy A55</div>
                  <div className="text-[11px] text-[#6B7B6B] mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" /> TechPlus Lomé • Bè</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-[#0E9F6E] text-[14px]">185 000 FCFA</span>
                    <span className="text-[10px] bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Neuf</span>
                  </div>
                </motion.div>

                {/* Floating Card - Service */}
                <motion.div 
                  initial={{ y: 20, opacity: 0, rotate: 4 }}
                  animate={{ y: 0, opacity: 1, rotate: 3 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute top-24 -right-8 w-[200px] bg-white rounded-[20px] border border-[#E8E0D0] p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=100" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" alt="Salon" />
                    <div>
                      <div className="font-bold text-[12px]">Salon Élégance</div>
                      <div className="text-[11px] text-[#6B7B6B] flex items-center gap-1">⭐ 4.8 • Tokoin • <span className="h-1.5 w-1.5 bg-[#0E9F6E] rounded-full inline-block" /> Ouvert</div>
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold leading-tight">Coiffure Homme & Femme</div>
                  <div className="text-[11px] text-[#6B7B6B] mt-1">À partir de 2 000 FCFA</div>
                  <div className="mt-2.5 flex gap-1.5">
                    <span className="text-[10px] bg-[#25D366] text-white px-2.5 py-1 rounded-full font-bold">WhatsApp</span>
                    <span className="text-[10px] bg-[#FFF8E7] border border-[#E8E0D0] px-2.5 py-1 rounded-full font-medium">Réserver</span>
                  </div>
                </motion.div>

                {/* Floating Card - Immobilier */}
                <motion.div 
                  initial={{ y: 20, opacity: 0, rotate: -2 }}
                  animate={{ y: 0, opacity: 1, rotate: -1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute bottom-20 -left-8 w-[210px] bg-white rounded-[20px] border border-[#E8E0D0] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                >
                  <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300" className="w-full h-[90px] object-cover rounded-[12px] mb-2.5" alt="Appartement" />
                  <div className="font-bold text-[12px] leading-tight">Appartement 3p - Cité OUA</div>
                  <div className="text-[11px] text-[#6B7B6B] flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> Lomé • 85m² • 3 pièces</div>
                  <div className="mt-1.5 font-bold text-[13px] text-[#06B6D4]">120 000 FCFA/mois</div>
                </motion.div>

                {/* Floating Card - Comparateur */}
                <motion.div 
                  initial={{ y: 20, opacity: 0, rotate: 3 }}
                  animate={{ y: 0, opacity: 1, rotate: 2 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -bottom-4 right-2 w-[190px] bg-[#1A2E1A] rounded-[18px] p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] text-white border border-white/10"
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-[#86EFAC] mb-2.5 font-medium"><TrendingUp className="h-3.5 w-3.5" /> Comparateur Vayeko</div>
                  <div className="text-[12px] font-bold">Galaxy A55 128Go</div>
                  <div className="mt-2.5 space-y-2">
                    <div className="flex justify-between text-[11px]"><span className="text-white/60">TechPlus Lomé</span><span className="font-bold">185k</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-white/60">Kara Électro</span><span className="font-bold">195k</span></div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="text-[10px] text-[#86EFAC] font-medium bg-white/10 rounded-full px-2 py-1 text-center">Économie 10 000 FCFA à Lomé</div>
                  </div>
                </motion.div>

                {/* Badge Togo */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
                  className="absolute top-1/2 -right-4 bg-white rounded-full px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-[#E8E0D0] flex items-center gap-1.5 text-[11px] font-bold"
                >
                  <span className="text-[14px]">🇹🇬</span> 100% Togolais
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile - Image locale */}
        <div className="lg:hidden mt-8 relative h-[320px] rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" 
            alt="Communauté Vayeko Togo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/60 via-[#1A2E1A]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="font-bold text-[18px] leading-tight">Rejoignez 1 200+ vendeurs vérifiés</div>
            <div className="text-[13px] opacity-80 mt-1">De Lomé à Dapaong, Vayeko connecte le Togo</div>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-[11px] font-bold text-[#1A2E1A]">🇹🇬 Made in Togo</div>
        </div>
      </div>
    </section>
  )
}
