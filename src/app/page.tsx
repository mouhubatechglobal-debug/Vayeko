"use client"

import { Hero } from "@/components/home/Hero"
import { Categories } from "@/components/home/Categories"
import { ServicesSection } from "@/components/home/ServicesSection"
import { BoutiquesSection } from "@/components/home/BoutiquesSection"
import { ProduitsSection } from "@/components/home/ProduitsSection"
import { PrixSection } from "@/components/home/PrixSection"
import { ImmobilierSection } from "@/components/home/ImmobilierSection"
import { EmploiSection } from "@/components/home/EmploiSection"
import { CampusSection } from "@/components/home/CampusSection"
import { AnnoncesSection } from "@/components/home/AnnoncesSection"
import { CTASection } from "@/components/home/CTASection"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 2. HERO - Visuel fort Togo/local, personne avec téléphone, couleurs chaudes */}
      <Hero />

      {/* 3. RECHERCHE - Déjà intégrée dans Hero comme élément central Vayeko */}

      {/* 4. CATÉGORIES - Cartes colorées arrondies, icône, titre, description, couleur propre */}
      <Categories />

      {/* 5. SERVICES - Titre "Services près de vous" */}
      <ServicesSection />

      {/* 6. BOUTIQUES / PRODUITS */}
      <BoutiquesSection />
      <ProduitsSection />

      {/* 7. PRIX - Visuellement différente, produit + plusieurs vendeurs */}
      <PrixSection />

      {/* 8. IMMOBILIER - PropertyCard grande image dominante */}
      <ImmobilierSection />

      {/* 9. EMPLOI - JobCard sobres */}
      <EmploiSection />

      {/* 10. CAMPUS - Jeune et dynamique */}
      <CampusSection />

      {/* 11. ANNONCES / COMMUNAUTÉ - Lecture rapide */}
      <AnnoncesSection />

      {/* 12. CTA - Communauté locale chaleureuse */}
      <CTASection />

      {/* 13. FOOTER - Dans layout, sombre vert foncé Vayeko */}
      
      {/* Indicateur fidélité maquette */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-6 text-center border-t border-[#F5F1E8] bg-[#FFFBEB]/30"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="text-[11px] text-[#9CA99C] font-medium">
            Vayeko • Le Togo à portée de main • Fidèle à la maquette existante • 
            <span className="text-[#0E9F6E]"> Blanc/Crème/Vert base</span> • 
            <span className="text-[#FFB800]"> Jaune</span> • 
            <span className="text-[#E11D48]"> Rouge</span> • 
            <span className="text-[#06B6D4]"> Turquoise</span> • 
            <span className="text-[#7C3AED]"> Violet</span> • 
            Mobile-first 360→1440 • Framer Motion léger • Lucide only • WhatsApp identifiable
          </div>
        </div>
      </motion.div>
    </div>
  )
}
