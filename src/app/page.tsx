"use client"

import { Hero } from "@/components/home/Hero"
import { CategoriesBar } from "@/components/home/CategoriesBar"
import { CategoriesGrid } from "@/components/home/CategoriesGrid"
import { ValeursSection } from "@/components/home/ValeursSection"
import { ProduitsPopulairesSection } from "@/components/home/ProduitsPopulairesSection"
import { CTACommunaute } from "@/components/home/CTACommunaute"
import { ServicesSection } from "@/components/home/ServicesSection"
import { BoutiquesSection } from "@/components/home/BoutiquesSection"
import { PrixSection } from "@/components/home/PrixSection"
import { ImmobilierSection } from "@/components/home/ImmobilierSection"
import { EmploiSection } from "@/components/home/EmploiSection"
import { CampusSection } from "@/components/home/CampusSection"
import { AnnoncesSection } from "@/components/home/AnnoncesSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* HERO PRINCIPAL - grande photo femme togolaise vêtement traditionnel coloré headwrap, regarde téléphone sourit, décor Togo */}
      <Hero />

      {/* BARRE CATÉGORIES VERTE - 6 catégories Services/Boutiques/Prix/Immobilier/Emploi/Campus, cercle blanc + icône + accent jaune + nom blanc */}
      <CategoriesBar />

      {/* SECTION CATÉGORIES - Découvre nos catégories + Voir tout, 6 grandes cartes photo couleur forte */}
      <CategoriesGrid />

      {/* BANDEAU VALEURS - Local, Fiable, Rapide, Pour tous, crème/jaune pâle */}
      <ValeursSection />

      {/* PRODUITS POPULAIRES - Arachide, Pagne Wax, Tomate, Maïs, prix FCFA jaune/or, note */}
      <ProduitsPopulairesSection />

      {/* SERVICES PRÈS DE VOUS - ServiceCard avec WhatsApp */}
      <ServicesSection />

      {/* BOUTIQUES LOCALES */}
      <BoutiquesSection />

      {/* PRIX - Comparez les prix, visuellement différente */}
      <PrixSection />

      {/* IMMOBILIER - PropertyCard grande image */}
      <ImmobilierSection />

      {/* EMPLOI - JobCard sobres */}
      <EmploiSection />

      {/* CAMPUS - jeune dynamique */}
      <CampusSection />

      {/* ANNONCES - lecture rapide */}
      <AnnoncesSection />

      {/* CTA COMMUNAUTAIRE - Ensemble pour un Togo digital et plus fort ! */}
      <CTACommunaute />

      {/* FOOTER + MOTIF FINAL - dans layout */}
    </div>
  )
}
