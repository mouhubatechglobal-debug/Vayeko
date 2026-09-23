"use client"

import { useEffect, useState } from "react"
import { getStoredUser, type UserSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Package, Calendar, Star, TrendingUp, MessageCircle, Users, DollarSign, Plus, Eye } from "lucide-react"
import Link from "next/link"
import { products, shops } from "@/lib/data"
import { formatPrice } from "@/lib/utils"

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'reservations' | 'reviews'>('overview')

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center p-4">
        <Card className="p-8 max-w-[400px] w-full text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="font-bold text-lg">Connexion requise</h2>
          <p className="text-sm text-[#6B7B6B] mt-2">Vous devez être connecté pour accéder au dashboard vendeur/professionnel.</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Link href="/auth/login"><Button className="rounded-full">Se connecter</Button></Link>
            <Link href="/auth/register"><Button variant="outline" className="rounded-full">Créer un compte</Button></Link>
          </div>
          <div className="mt-4 text-xs text-[#6B7B6B]">Comptes démo : vendeur@vayeko.tg / vendeur123 • pro@vayeko.tg / pro123 • admin@vayeko.tg / admin123</div>
        </Card>
      </div>
    )
  }

  const myShop = shops[0]
  const myProducts = products.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-[#1A2E1A] text-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full border-2 border-white/20" />
              <div>
                <h1 className="text-xl font-bold">Dashboard {user.name}</h1>
                <div className="text-xs text-white/70 flex items-center gap-2"><Badge className="bg-white/20 text-white text-[10px]">{user.roles.join(' • ')}</Badge> {myShop.name} • {myShop.city}</div>
              </div>
            </div>
            <Link href="/boutiques/techplus-lome"><Button variant="secondary" className="rounded-full bg-white text-[#1A2E1A] gap-2"><Eye className="h-4 w-4" /> Voir ma boutique</Button></Link>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
              { id: 'products', label: 'Produits', icon: Package },
              { id: 'orders', label: 'Commandes', icon: Store },
              { id: 'reservations', label: 'Réservations', icon: Calendar },
              { id: 'reviews', label: 'Avis', icon: Star },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${activeTab === tab.id ? 'bg-white text-[#1A2E1A] border-white' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15'}`}><tab.icon className="h-4 w-4" /> {tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5"><div className="flex items-center justify-between"><div><div className="text-xs text-[#6B7B6B]">Revenus ce mois</div><div className="text-2xl font-bold mt-1">1 240 000 FCFA</div><div className="text-xs text-[#0E9F6E] mt-1">+12% vs mois dernier</div></div><div className="h-10 w-10 rounded-full bg-[#D1FAE5] flex items-center justify-center"><DollarSign className="h-5 w-5 text-[#0E9F6E]" /></div></div></Card>
              <Card className="p-5"><div className="flex items-center justify-between"><div><div className="text-xs text-[#6B7B6B]">Commandes</div><div className="text-2xl font-bold mt-1">23</div><div className="text-xs text-[#6B7B6B] mt-1">3 en attente</div></div><div className="h-10 w-10 rounded-full bg-[#FEF3C7] flex items-center justify-center"><Package className="h-5 w-5 text-[#92400E]" /></div></div></Card>
              <Card className="p-5"><div className="flex items-center justify-between"><div><div className="text-xs text-[#6B7B6B]">Produits actifs</div><div className="text-2xl font-bold mt-1">156</div><div className="text-xs text-[#6B7B6B] mt-1">12 en rupture</div></div><div className="h-10 w-10 rounded-full bg-[#EDE9FE] flex items-center justify-center"><Store className="h-5 w-5 text-[#7C3AED]" /></div></div></Card>
              <Card className="p-5"><div className="flex items-center justify-between"><div><div className="text-xs text-[#6B7B6B]">Note moyenne</div><div className="text-2xl font-bold mt-1">4.7 ⭐</div><div className="text-xs text-[#6B7B6B] mt-1">234 avis</div></div><div className="h-10 w-10 rounded-full bg-[#FFE4E6] flex items-center justify-center"><Star className="h-5 w-5 text-[#E11D48]" /></div></div></Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-5">
                <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Commandes récentes</h3><Link href="#" className="text-xs text-[#0E9F6E] font-medium">Voir tout →</Link></div>
                <div className="space-y-3">
                  {[
                    { id: 'CMD-001', product: 'Samsung Galaxy A55', client: 'Afi M.', total: '185 000 FCFA', status: 'NEW' },
                    { id: 'CMD-002', product: 'Pagne Wax', client: 'Komi D.', total: '50 000 FCFA', status: 'CONFIRMED' },
                    { id: 'CMD-003', product: 'Huile palme 5L', client: 'Jean K.', total: '6 500 FCFA', status: 'PREPARING' },
                  ].map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-[#FFFBEB] rounded-[12px]">
                      <div><div className="font-medium text-sm">{o.id} • {o.product}</div><div className="text-xs text-[#6B7B6B]">Client: {o.client} • {o.total}</div></div>
                      <div className="flex items-center gap-2"><Badge variant="secondary" className="text-[11px]">{o.status}</Badge><Button size="sm" className="rounded-full h-7 text-xs">Gérer</Button></div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-4">Activité</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex gap-2"><div className="h-2 w-2 rounded-full bg-[#0E9F6E] mt-1.5" /><div><div className="font-medium">Nouvelle commande #CMD-001</div><div className="text-[#6B7B6B]">Il y a 10 min • Samsung Galaxy A55</div></div></div>
                  <div className="flex gap-2"><div className="h-2 w-2 rounded-full bg-[#06B6D4] mt-1.5" /><div><div className="font-medium">Nouveau message WhatsApp</div><div className="text-[#6B7B6B]">Il y a 23 min • Afi demande disponibilité</div></div></div>
                  <div className="flex gap-2"><div className="h-2 w-2 rounded-full bg-[#FFB800] mt-1.5" /><div><div className="font-medium">Avis 5 étoiles reçu</div><div className="text-[#6B7B6B]">Il y a 1h • Très bon service !</div></div></div>
                  <div className="flex gap-2"><div className="h-2 w-2 rounded-full bg-[#7C3AED] mt-1.5" /><div><div className="font-medium">Produit mis à jour</div><div className="text-[#6B7B6B]">Il y a 2h • Stock iPhone 13</div></div></div>
                </div>
                <Button variant="outline" className="w-full mt-4 rounded-full text-xs">Voir toute l&apos;activité</Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6"><h2 className="font-bold text-lg">Mes produits ({myProducts.length})</h2><Button className="rounded-full gap-2"><Plus className="h-4 w-4" /> Ajouter un produit</Button></div>
            <div className="grid md:grid-cols-3 gap-4">
              {myProducts.map(p => (
                <Card key={p.id} className="overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-xs text-[#6B7B6B]">{p.category} • Stock: {p.stock}</div>
                    <div className="font-bold text-[#0E9F6E] mt-1">{formatPrice(p.price)}</div>
                    <div className="mt-3 flex gap-2"><Button size="sm" variant="outline" className="flex-1 rounded-full">Modifier</Button><Button size="sm" className="flex-1 rounded-full">Voir</Button></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'products' && (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <h3 className="font-semibold">Module {activeTab} en construction</h3>
            <p className="text-sm text-[#6B7B6B] mt-1 max-w-[400px] mx-auto">Cette section du dashboard sera bientôt disponible avec gestion complète des {activeTab}, statuts, historique et notifications.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
