import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Store, Users, TrendingUp, ShieldCheck, Zap, HeartHandshake } from "lucide-react"

export default function DevenirVendeurPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-[#1A2E1A] text-white py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs mb-4">🇹🇬 100% Togolais • 0% commission cachée</div>
          <h1 className="text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-tight">Vendez sur Vayeko<br/><span className="text-[#86EFAC]">et touchez tout le Togo</span></h1>
          <p className="mt-4 text-white/70 max-w-[600px] mx-auto">Créez votre boutique en 2 minutes, publiez vos produits, recevez commandes et réservations par WhatsApp. Sans abonnement caché.</p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/inscription"><Button size="lg" className="rounded-full bg-white text-[#1A2E1A] hover:bg-[#FFFBEB] h-12 px-8">Créer ma boutique gratuitement</Button></Link>
            <Link href="/vendeur"><Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 h-12 px-8 bg-transparent">Voir dashboard démo</Button></Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6"><div className="h-12 w-12 rounded-[12px] bg-[#D1FAE5] flex items-center justify-center mb-4"><Store className="h-6 w-6 text-[#0E9F6E]" /></div><h3 className="font-bold">Boutique en ligne</h3><p className="text-sm text-[#6B7B6B] mt-2 leading-relaxed">Produits illimités, stock, variantes, livraison/retrait, prix avec date maj visible, comparateur intégré.</p></Card>
          <Card className="p-6"><div className="h-12 w-12 rounded-[12px] bg-[#CFFAFE] flex items-center justify-center mb-4"><Users className="h-6 w-6 text-[#06B6D4]" /></div><h3 className="font-bold">Services & Réservations</h3><p className="text-sm text-[#6B7B6B] mt-2 leading-relaxed">Calendrier, créneaux, confirmation/refus/modification, notifications, avis clients.</p></Card>
          <Card className="p-6"><div className="h-12 w-12 rounded-[12px] bg-[#FEF3C7] flex items-center justify-center mb-4"><Zap className="h-6 w-6 text-[#92400E]" /></div><h3 className="font-bold">WhatsApp Direct</h3><p className="text-sm text-[#6B7B6B] mt-2 leading-relaxed">Boutons WhatsApp partout, message prérempli, contact direct, pas de commission sur messages.</p></Card>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-[28px] font-bold leading-tight">Pourquoi Vayeko et pas Facebook / WhatsApp seul ?</h2>
            <div className="mt-6 space-y-4">
              <div className="flex gap-3"><ShieldCheck className="h-5 w-5 text-[#0E9F6E] shrink-0 mt-0.5" /><div><div className="font-semibold text-sm">Visibilité nationale</div><div className="text-sm text-[#6B7B6B]">Vos produits visibles à Lomé, Kara, Sokodé... pas seulement dans un groupe WhatsApp</div></div></div>
              <div className="flex gap-3"><TrendingUp className="h-5 w-5 text-[#0E9F6E] shrink-0 mt-0.5" /><div><div className="font-semibold text-sm">Comparateur prix = confiance</div><div className="text-sm text-[#6B7B6B]">Les clients comparent et choisissent en toute transparence, date maj visible</div></div></div>
              <div className="flex gap-3"><HeartHandshake className="h-5 w-5 text-[#0E9F6E] shrink-0 mt-0.5" /><div><div className="font-semibold text-sm">Avis vérifiés + RLS sécurisé</div><div className="text-sm text-[#6B7B6B]">Permissions vérifiées côté serveur, favoris privés, audit admin, pas de vol de données</div></div></div>
            </div>
          </div>
          <Card className="p-6 bg-[#FFFBEB] border-[#E8E0D0]">
            <h3 className="font-bold">Types d&apos;activité possibles</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-[12px] p-3 border border-[#E8E0D0]"><div className="font-medium">Boutique</div><div className="text-xs text-[#6B7B6B]">Produits & commandes</div></div>
              <div className="bg-white rounded-[12px] p-3 border border-[#E8E0D0]"><div className="font-medium">Service</div><div className="text-xs text-[#6B7B6B]">Réservations</div></div>
              <div className="bg-white rounded-[12px] p-3 border border-[#E8E0D0]"><div className="font-medium">Immobilier</div><div className="text-xs text-[#6B7B6B]">Biens à louer/vendre</div></div>
              <div className="bg-white rounded-[12px] p-3 border border-[#E8E0D0]"><div className="font-medium">Emploi</div><div className="text-xs text-[#6B7B6B]">Offres & recrutement</div></div>
              <div className="bg-white rounded-[12px] p-3 border border-[#E8E0D0]"><div className="font-medium">Restaurant</div><div className="text-xs text-[#6B7B6B]">Menus & commandes</div></div>
              <div className="bg-white rounded-[12px] p-3 border border-[#E8E0D0]"><div className="font-medium">Autre</div><div className="text-xs text-[#6B7B6B]">Annonces diverses</div></div>
            </div>
            <Link href="/inscription" className="mt-6 block"><Button className="w-full rounded-full h-11">Commencer maintenant — Gratuit</Button></Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
