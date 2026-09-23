import { Hero } from "@/components/home/Hero"
import { Categories } from "@/components/home/Categories"
import { ProductGrid } from "@/components/home/ProductGrid"
import { ServicesSection } from "@/components/home/ServicesSection"
import { ImmoJobsSection } from "@/components/home/ImmoJobsSection"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Zap, HeartHandshake, Store, Users, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <ProductGrid />
      <ServicesSection />
      <ImmoJobsSection />

      {/* Comparateur highlight */}
      <section className="py-10 bg-[#1A2E1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-20" />
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
                <TrendingUp className="h-3.5 w-3.5" /> Comparateur de prix Vayeko
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold leading-[1.1] tracking-tight">
                Ne payez plus trop cher.<br />
                <span className="text-[#86EFAC]">Comparez avant d&apos;acheter.</span>
              </h2>
              <p className="mt-4 text-[#A8C5A8] leading-relaxed max-w-[480px]">
                Recherchez un produit et voyez instantanément où il est le moins cher, avec la date de mise à jour et la disponibilité. Transparence totale.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/comparateur">
                  <Button size="lg" className="rounded-full bg-white text-[#1A2E1A] hover:bg-[#FFFBEB] gap-2">
                    Comparer un prix <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#86EFAC]">
                  <ShieldCheck className="h-4 w-4" /> Prix vérifiés • Date visible
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-5 text-[#1A2E1A] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold">Samsung Galaxy A55 128Go</div>
                <div className="text-xs bg-[#D1FAE5] text-[#065F46] px-2.5 py-1 rounded-full">3 offres</div>
              </div>
              <div className="space-y-3">
                {[
                  { shop: 'TechPlus Lomé', city: 'Lomé • Bè', price: '185 000', date: '21 sept', best: true },
                  { shop: 'Kara Électro', city: 'Kara • Centre', price: '195 000', date: '21 sept', best: false },
                  { shop: 'Mobile Shop Adidogomé', city: 'Lomé • Adidogomé', price: '189 000', date: '19 sept', best: false },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-[12px] border ${row.best ? 'bg-[#D1FAE5] border-[#86EFAC]' : 'bg-[#FFFBEB] border-[#E8E0D0]'}`}>
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {row.shop} {row.best && <span className="text-[10px] bg-[#0E9F6E] text-white px-1.5 py-0.5 rounded-full">Meilleur prix</span>}
                      </div>
                      <div className="text-xs text-[#6B7B6B]">{row.city} • Maj: {row.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{row.price} FCFA</div>
                      <div className="text-[11px] text-[#0E9F6E]">Disponible • Contacter</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-[#9CA99C] text-center">Les prix sont mis à jour par les vendeurs. Vérifiez toujours la date.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Vendeur */}
      <section className="py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-gradient-to-br from-[#FFFBEB] to-[#FFF8E7] border border-[#E8E0D0] p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFB800]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#0E9F6E]/10 rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-[28px] sm:text-[36px] font-bold leading-[1.1] tracking-tight text-[#1A2E1A]">
                  Vous vendez au Togo ?<br />
                  Rejoignez Vayeko.
                </h2>
                <p className="mt-4 text-[#6B7B6B] leading-relaxed max-w-[480px]">
                  Créez votre boutique en 2 minutes, publiez vos produits et services, recevez des commandes et réservations par WhatsApp. Sans abonnement caché.
                </p>

                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center shrink-0"><Store className="h-5 w-5 text-[#0E9F6E]" /></div>
                    <div>
                      <div className="font-semibold text-sm">Boutique</div>
                      <div className="text-xs text-[#6B7B6B]">Produits & commandes</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center shrink-0"><Users className="h-5 w-5 text-[#06B6D4]" /></div>
                    <div>
                      <div className="font-semibold text-sm">Services</div>
                      <div className="text-xs text-[#6B7B6B]">Réservations</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-white border border-[#E8E0D0] flex items-center justify-center shrink-0"><Zap className="h-5 w-5 text-[#FFB800]" /></div>
                    <div>
                      <div className="font-semibold text-sm">WhatsApp</div>
                      <div className="text-xs text-[#6B7B6B]">Contact direct</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/auth/register">
                    <Button size="lg" className="rounded-full h-12 px-8">Créer ma boutique gratuitement</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="rounded-full h-12 px-8 bg-white">Voir le dashboard</Button>
                  </Link>
                </div>
              </div>

              <div className="relative lg:h-[380px] flex items-center justify-center">
                <div className="bg-white rounded-[20px] border border-[#E8E0D0] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-full max-w-[380px] rotate-[-2deg]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-12 w-12 rounded-full bg-[#0E9F6E] flex items-center justify-center text-white font-bold">T</div>
                    <div>
                      <div className="font-bold">TechPlus Lomé</div>
                      <div className="text-xs text-[#6B7B6B] flex items-center gap-1"><span className="h-2 w-2 bg-green-500 rounded-full" /> En ligne • 12 commandes aujourd&apos;hui</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-[#6B7B6B]">Revenus ce mois</span><span className="font-bold">1 240 000 FCFA</span></div>
                    <div className="h-2 bg-[#F5F1E8] rounded-full overflow-hidden"><div className="h-full w-[72%] bg-[#0E9F6E] rounded-full" /></div>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-[#FFFBEB] rounded-[12px] p-3 text-center"><div className="font-bold">156</div><div className="text-[11px] text-[#6B7B6B]">Produits</div></div>
                      <div className="bg-[#D1FAE5] rounded-[12px] p-3 text-center"><div className="font-bold">4.7 ⭐</div><div className="text-[11px] text-[#065F46]">Note</div></div>
                      <div className="bg-[#FEF3C7] rounded-[12px] p-3 text-center"><div className="font-bold">89%</div><div className="text-[11px] text-[#92400E]">Réponse</div></div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 h-9 bg-[#1A2E1A] text-white rounded-full flex items-center justify-center text-xs font-medium">Commandes (3)</div>
                    <div className="flex-1 h-9 bg-[#FFF8E7] border border-[#E8E0D0] rounded-full flex items-center justify-center text-xs font-medium">Messages (12)</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-2 bg-[#1A2E1A] text-white rounded-[14px] px-4 py-2.5 shadow-lg rotate-[3deg] hidden sm:flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-[#86EFAC]" />
                  <span className="text-xs font-medium">+2 103 clients satisfaits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
