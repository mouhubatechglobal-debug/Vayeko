"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTACommunaute() {
  return (
    <section className="py-10 sm:py-12 bg-[#FFFBEB]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] overflow-hidden bg-[#0A2A12] border border-[#0A2A12] shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
          {/* Arrière-plan image paysage/ville côtière */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55e5?w=1200&q=80"
              alt="Paysage côtier Togo Lomé"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A12] via-[#0A2A12]/90 to-[#0A2A12]/70" />
          </div>

          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center p-8 sm:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold leading-[0.95] tracking-tight text-white">
                Ensemble pour un Togo
                <br />
                <span className="text-[#86EFAC]">digital et plus fort !</span>
              </h2>
              <p className="mt-4 text-[14px] sm:text-[15px] text-white/70 leading-relaxed max-w-[480px]">
                Rejoignez la communauté Vayeko et profitez des meilleures opportunités près de chez vous.
              </p>
              <Link href="/inscription" className="inline-block mt-6">
                <Button className="rounded-full bg-[#FFB800] hover:bg-[#E6A600] text-[#1A2E1A] font-bold h-12 px-8 gap-2 shadow-sm">
                  Commencer maintenant <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Représentation graphique Togo avec couleurs vert/jaune/rouge */}
              <div className="relative w-[280px] h-[280px]">
                {/* Togo shape stylisé */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[180px] h-[240px] relative">
                    {/* Vert */}
                    <div className="absolute top-0 left-0 right-0 h-[48px] bg-[#0E9F6E] rounded-t-[16px]" />
                    {/* Jaune */}
                    <div className="absolute top-[48px] left-0 right-0 h-[48px] bg-[#FFB800] flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[16px]">⭐</div>
                    </div>
                    {/* Rouge */}
                    <div className="absolute top-[96px] left-0 right-0 h-[48px] bg-[#E11D48]" />
                    {/* Vert */}
                    <div className="absolute top-[144px] left-0 right-0 h-[48px] bg-[#0E9F6E]" />
                    {/* Jaune */}
                    <div className="absolute top-[192px] left-0 right-0 h-[48px] bg-[#FFB800] rounded-b-[16px]" />
                    
                    {/* Border */}
                    <div className="absolute inset-0 border-4 border-white rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]" />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-4 -right-2 bg-white rounded-full px-3 py-1.5 shadow-lg text-[11px] font-bold text-[#1A2E1A] rotate-3">🇹🇬 6 villes</div>
                <div className="absolute bottom-8 -left-4 bg-[#FFB800] rounded-full px-3 py-1.5 shadow-lg text-[11px] font-bold text-[#1A2E1A] -rotate-2">1 200+ vendeurs</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
