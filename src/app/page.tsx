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
      {/* NAVBAR - blanche compacte comme maquette */}
      
      {/* HERO - grande photo femme togolaise traditionnelle colorée headwrap téléphone sourit, Vayeko Le Togo à portée de main, badge 100% Togolais, barre recherche Lomé */}
      <Hero />

      {/* BARRE CATÉGORIES VERTE - 6 catégories Services Boutiques Prix Immobilier Emploi Campus cercle blanc + accent jaune + nom blanc */}
      <CategoriesBar />

      {/* DÉCOUVRE NOS CATÉGORIES - 6 grandes cartes photo couleur forte comme maquette */}
      <CategoriesGrid />

      {/* BANDEAU VALEURS - 4 cartes Local Fiable Rapide Pour tous crème */}
      <ValeursSection />

      {/* PRODUITS POPULAIRES - Arachide Pagne wax Tomate Maïs prix FCFA note étoile */}
      <ProduitsPopulairesSection />

      {/* CTA COMMUNAUTAIRE - Ensemble pour un Togo digital et plus fort ! + carte Togo vert/jaune/rouge + côte Lomé */}
      <CTACommunaute />

      {/* FOOTER + MOTIF FINAL - dans layout.tsx */}
    </div>
  )
}
