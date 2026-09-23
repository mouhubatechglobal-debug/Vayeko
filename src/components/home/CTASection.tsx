"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Store, Users, Zap, HeartHandshake, ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-gradient-to-br from-[#FFFBEB] to-[#FFF8E7] border border-[#E8E0D0] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFB800]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0E9F6E]/10 rounded-full blur-[50px] translate-y-1/3 -translate-x-1/4" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white border border-[#E8E0D0] rounded-full px-3.5 py-1.5 text-xs font-bold mb-4 shadow-sm">
                <span className="text-[14px]">🇹🇬</span> Communauté Vayeko • 1 200+ vendeurs
              </div>
              <h2 className="text-[28px] sm:text-[38px] font-extrabold leading-[0.95] tracking-tight text-[#1A2E1A]">
                Rejoignez la
                <br />
                communauté
                <br />
                <span className="text-[#0E9F6E]">Vayeko</span>
              </h2>
              <p className="mt-4 text-[15px] text-[#6B7B6B] leading-relaxed max-w-[480px] font-medium">
                Vous vendez au Togo ? Créez votre boutique en 2 minutes, publiez vos produits et services, recevez des commandes et réservations par WhatsApp. Sans abonnement caché, 100% local.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="h-11 w-11 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center shrink-0 shadow-sm"><Store className="h-5 w-5 text-[#0E9F6E]" /></div>
                  <div>
                    <div className="font-bold text-[13px]">Boutique</div>
                    <div className="text-[11px] text-[#6B7B6B] leading-tight">Produits & commandes</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-11 w-11 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center shrink-0 shadow-sm"><Users className="h-5 w-5 text-[#06B6D4]" /></div>
                  <div>
                    <div className="font-bold text-[13px]">Services</div>
                    <div className="text-[11px] text-[#6B7B6B] leading-tight">Réservations</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-11 w-11 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center shrink-0 shadow-sm"><Zap className="h-5 w-5 text-[#FFB800]" /></div>
                  <div>
                    <div className="font-bold text-[13px]">WhatsApp</div>
                    <div className="text-[11px] text-[#6B7B6B] leading-tight">Contact direct</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/inscription">
                  <Button size="lg" className="rounded-full h-12 px-8 font-bold gap-2">Créer ma boutique <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link href="/devenir-vendeur">
                  <Button size="lg" variant="outline" className="rounded-full h-12 px-8 bg-white font-semibold">En savoir plus</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:h-[380px] flex items-center justify-center"
            >
              <div className="bg-white rounded-[20px] border border-[#E8E0D0] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] w-full max-w-[380px] rotate-[-1deg]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-12 w-12 rounded-full bg-[#0E9F6E] flex items-center justify-center text-white font-bold shadow-sm">T</div>
                  <div>
                    <div className="font-bold">TechPlus Lomé</div>
                    <div className="text-xs text-[#6B7B6B] flex items-center gap-1.5"><span className="h-2 w-2 bg-[#0E9F6E] rounded-full animate-pulse" /> En ligne • 12 commandes aujourd&apos;hui</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-[#6B7B6B]">Revenus ce mois</span><span className="font-bold">1 240 000 FCFA</span></div>
                  <div className="h-2.5 bg-[#F5F1E8] rounded-full overflow-hidden"><div className="h-full w-[72%] bg-[#0E9F6E] rounded-full" /></div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-[#FFFBEB] rounded-[14px] p-3 text-center border border-[#E8E0D0]/50"><div className="font-bold text-[16px]">156</div><div className="text-[11px] text-[#6B7B6B] font-medium">Produits</div></div>
                    <div className="bg-[#D1FAE5] rounded-[14px] p-3 text-center border border-[#86EFAC]/30"><div className="font-bold text-[16px]">4.7 ⭐</div><div className="text-[11px] text-[#065F46] font-medium">Note</div></div>
                    <div className="bg-[#FEF3C7] rounded-[14px] p-3 text-center border border-[#FCD34D]/30"><div className="font-bold text-[16px]">89%</div><div className="text-[11px] text-[#92400E] font-medium">Réponse</div></div>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <div className="flex-1 h-10 bg-[#1A2E1A] text-white rounded-full flex items-center justify-center text-xs font-bold">Commandes (3)</div>
                  <div className="flex-1 h-10 bg-[#FFF8E7] border border-[#E8E0D0] rounded-full flex items-center justify-center text-xs font-bold">Messages (12)</div>
                </div>
              </div>

              <div className="absolute -bottom-3 -right-2 bg-[#1A2E1A] text-white rounded-[14px] px-4 py-2.5 shadow-lg rotate-[2deg] hidden sm:flex items-center gap-2 border border-white/10">
                <HeartHandshake className="h-4 w-4 text-[#86EFAC]" />
                <span className="text-xs font-bold">+2 103 clients satisfaits</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
