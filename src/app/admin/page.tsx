"use client"

import { useEffect, useState } from "react"
import { getStoredUser, type UserSession } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Store, Package, Flag, DollarSign, ShieldCheck, Activity, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  if (!user || !user.roles.includes('ADMIN')) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center p-4">
        <Card className="p-8 max-w-[420px] w-full text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="font-bold text-lg">Accès administrateur requis</h2>
          <p className="text-sm text-[#6B7B6B] mt-2">Cette page est réservée aux administrateurs Vayeko. Connectez-vous avec admin@vayeko.tg / admin123</p>
          <Link href="/auth/login" className="mt-4 inline-block"><Button className="rounded-full">Connexion admin</Button></Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-[#1A2E1A] text-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-[#86EFAC]" /><div><h1 className="text-xl font-bold">Administration Vayeko</h1><div className="text-xs text-white/70">Audit • Modération • Gestion plateforme</div></div></div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="bg-white/10 border-white/20 p-4 text-white"><div className="flex items-center justify-between"><div><div className="text-xs opacity-70">Utilisateurs</div><div className="text-xl font-bold mt-1">1 248</div></div><Users className="h-5 w-5 opacity-60" /></div></Card>
            <Card className="bg-white/10 border-white/20 p-4 text-white"><div className="flex items-center justify-between"><div><div className="text-xs opacity-70">Boutiques</div><div className="text-xl font-bold mt-1">342</div></div><Store className="h-5 w-5 opacity-60" /></div></Card>
            <Card className="bg-white/10 border-white/20 p-4 text-white"><div className="flex items-center justify-between"><div><div className="text-xs opacity-70">Commandes</div><div className="text-xl font-bold mt-1">892</div></div><Package className="h-5 w-5 opacity-60" /></div></Card>
            <Card className="bg-white/10 border-white/20 p-4 text-white"><div className="flex items-center justify-between"><div><div className="text-xs opacity-70">Signalements</div><div className="text-xl font-bold mt-1">12</div></div><Flag className="h-5 w-5 opacity-60" /></div></Card>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-5 w-5" /> Activité récente (audit)</h3>
              <div className="space-y-3 text-xs">
                {[
                  { action: 'MODÉRATION', user: 'Admin', target: 'Produit prod-2 suspendu (prix suspect)', time: 'Il y a 10 min' },
                  { action: 'VALIDATION', user: 'Admin', target: 'Boutique TechPlus Lomé vérifiée', time: 'Il y a 1h' },
                  { action: 'SIGNALEMENT', user: 'Client Afi M.', target: 'Avis signalé - En cours d\'examen', time: 'Il y a 2h' },
                  { action: 'TRANSACTION', user: 'Système', target: 'Commande CMD-001 confirmée par vendeur', time: 'Il y a 3h' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-[#FFFBEB] rounded-[12px]">
                    <Badge variant="secondary" className="h-fit text-[10px]">{log.action}</Badge>
                    <div className="flex-1"><div className="font-medium">{log.target}</div><div className="text-[#6B7B6B] mt-0.5">{log.user} • {log.time}</div></div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-4">Gestion</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Utilisateurs', desc: 'Gérer rôles, bannir, vérifier', icon: Users },
                  { label: 'Vendeurs & Pros', desc: 'Vérification, suspension', icon: Store },
                  { label: 'Produits & Services', desc: 'Modération, validation', icon: Package },
                  { label: 'Commandes & Réservations', desc: 'Litiges, remboursements', icon: DollarSign },
                  { label: 'Immobilier, Emploi, Campus', desc: 'Modération contenu', icon: Settings },
                  { label: 'Avis & Signalements', desc: 'Modération avis', icon: Flag },
                ].map(item => (
                  <div key={item.label} className="border border-[#E8E0D0] rounded-[12px] p-4 hover:border-[#0E9F6E] cursor-pointer transition-colors">
                    <div className="flex items-center gap-2"><item.icon className="h-4 w-4" /><span className="font-medium text-sm">{item.label}</span></div>
                    <div className="text-xs text-[#6B7B6B] mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-3">Sécurité</h3>
              <ul className="text-xs text-[#6B7B6B] space-y-2 leading-relaxed">
                <li>✓ Permissions vérifiées côté serveur</li>
                <li>✓ Règles RLS base de données</li>
                <li>✓ Audit des actions admin</li>
                <li>✓ Favoris privés par utilisateur</li>
                <li>✓ WhatsApp déclenché par utilisateur</li>
                <li>✓ Prix avec date de mise à jour visible</li>
              </ul>
              <Button variant="outline" className="w-full mt-4 rounded-full text-xs">Voir logs sécurité</Button>
            </Card>

            <Card className="p-5 bg-[#1A2E1A] text-white">
              <h3 className="font-semibold">Paramètres plateforme</h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="opacity-70">Monnaie</span><span>FCFA</span></div>
                <div className="flex justify-between"><span className="opacity-70">Langue</span><span>Français</span></div>
                <div className="flex justify-between"><span className="opacity-70">Villes</span><span>6 villes</span></div>
                <div className="flex justify-between"><span className="opacity-70">WhatsApp</span><span>Activé</span></div>
              </div>
              <Button className="w-full mt-4 rounded-full bg-white text-[#1A2E1A] text-xs">Gérer paramètres</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
