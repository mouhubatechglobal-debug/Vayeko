"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShieldCheck, TrendingUp, MapPin, Clock } from "lucide-react"
import { formatPrice, formatRelativeTime } from "@/lib/utils"
import { products } from "@/lib/data"

export function PrixSection() {
  const product = products[0]
  const offers = [
    { shop: 'TechPlus Lomé', city: 'Lomé • Bè', price: 185000, date: new Date('2026-09-21'), best: true, stock: 12, rating: 4.7 },
    { shop: 'Kara Électro', city: 'Kara • Centre', price: 195000, date: new Date('2026-09-21'), best: false, stock: 8, rating: 4.5 },
    { shop: 'Mobile Shop Adidogomé', city: 'Lomé • Adidogomé', price: 189000, date: new Date('2026-09-19'), best: false, stock: 3, rating: 4.6 },
  ]

  return (
    <section className="py-12 sm:py-16 bg-[#1A2E1A] text-white relative overflow-hidden">
      <div className="absolute inset-0 african-pattern opacity-[0.08]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0E9F6E]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
      
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold mb-5">
              <TrendingUp className="h-4 w-4 text-[#86EFAC]" /> Comparateur de prix Vayeko
            </div>
            <h2 className="text-[30px] sm:text-[40px] font-extrabold leading-[0.95] tracking-tight">
              Comparez les prix
              <br />
              <span className="text-[#86EFAC]">avant d&apos;acheter.</span>
            </h2>
            <p className="mt-4 text-[16px] text-[#A8C5A8] leading-relaxed max-w-[480px]">
              Ne payez plus trop cher. Recherchez un produit et voyez instantanément où il est le moins cher, avec la date de mise à jour et la disponibilité. Transparence totale, sans commission cachée.
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#A8C5A8]"><ShieldCheck className="h-4 w-4 text-[#86EFAC]" /> Prix vérifiés avec date de mise à jour visible</div>
              <div className="flex items-center gap-2 text-sm text-[#A8C5A8]"><MapPin className="h-4 w-4 text-[#86EFAC]" /> Localisation vendeur + disponibilité en temps réel</div>
              <div className="flex items-center gap-2 text-sm text-[#A8C5A8]"><Clock className="h-4 w-4 text-[#86EFAC]" /> Ne jamais présenter ancien prix comme prix actuel vérifié</div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/prix">
                <Button size="lg" className="rounded-full bg-white text-[#1A2E1A] hover:bg-[#FFFBEB] gap-2 h-12 px-8 font-bold">
                  Comparer un prix <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#86EFAC] bg-white/10 rounded-full px-4 h-12 border border-white/10">
                Économie moyenne <span className="font-bold text-white">8% • 12 500 FCFA</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-[24px] p-6 text-[#1A2E1A] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-bold text-[16px]">{product.name}</div>
                <div className="text-xs text-[#6B7B6B] mt-1">Téléphones • 3 offres • Mise à jour aujourd&apos;hui</div>
              </div>
              <Badge className="bg-[#D1FAE5] text-[#065F46] font-bold">3 offres</Badge>
            </div>
            
            <div className="space-y-3">
              {offers.map((offer, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-[16px] border-2 transition-all ${offer.best ? 'bg-[#D1FAE5] border-[#0E9F6E] shadow-sm' : 'bg-[#FFFBEB] border-[#E8E0D0] hover:border-[#E8E0D0]'}`}>
                  <div className="flex-1">
                    <div className="font-bold text-[14px] flex items-center gap-2">
                      {offer.shop} 
                      {offer.best && <span className="text-[10px] bg-[#0E9F6E] text-white px-2 py-0.5 rounded-full font-bold">Meilleur prix</span>}
                      {offer.stock < 5 && <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full font-bold">Plus que {offer.stock}</span>}
                    </div>
                    <div className="text-[11px] text-[#6B7B6B] mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {offer.city}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Maj {formatRelativeTime(offer.date)}</span>
                      <span>•</span>
                      <span>⭐ {offer.rating}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-extrabold text-[16px]">{formatPrice(offer.price)}</div>
                    <div className="text-[11px] text-[#0E9F6E] font-medium mt-0.5">{offer.best ? 'Disponible • Économie 10k' : 'Disponible • Contacter'}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-[#FFFBEB] rounded-[12px] border border-[#E8E0D0]/50">
              <div className="text-[11px] text-[#6B7B6B] leading-relaxed text-center">
                ⚠️ Les prix sont mis à jour par les vendeurs. Vayeko affiche toujours la date de mise à jour. Vérifiez toujours la date avant achat.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
