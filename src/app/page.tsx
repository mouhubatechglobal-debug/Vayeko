"use client"

import { Hero } from "@/components/home/Hero"
import { CategoriesBar } from "@/components/home/CategoriesBar"
import { CategoriesGrid } from "@/components/home/CategoriesGrid"
import { ValeursSection } from "@/components/home/ValeursSection"
import { ProduitsPopulairesSection } from "@/components/home/ProduitsPopulairesSection"
import { CTACommunaute } from "@/components/home/CTACommunaute"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF8E6]">
      {/* Hero avec photo femme togolaise exactement comme maquette */}
      <Hero />

      {/* Barre catégories verte foncée avec 6 icônes comme maquette */}
      <CategoriesBar />

      {/* Découvre nos catégories - 6 cartes colorées comme maquette */}
      <CategoriesGrid />

      {/* Valeurs - Local Fiable Rapide Pour tous comme maquette */}
      <ValeursSection />

      {/* Produits populaires - Arachide Pagne wax Tomate Maïs comme maquette */}
      <ProduitsPopulairesSection />

      {/* CTA Ensemble pour un Togo digital et plus fort ! comme maquette */}
      <CTACommunaute />
    </div>
  )
}
