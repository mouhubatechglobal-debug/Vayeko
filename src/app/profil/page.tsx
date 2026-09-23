"use client"

import { useEffect, useState } from "react"
import { getStoredUser, clearStoredUser, type UserSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, LogOut, Settings, Heart, Package, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilPage() {
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center p-4">
        <Card className="p-8 max-w-[400px] w-full text-center">
          <div className="text-4xl mb-3">👤</div>
          <h2 className="font-bold">Non connecté</h2>
          <p className="text-sm text-[#6B7B6B] mt-1">Connectez-vous pour voir votre profil</p>
          <Link href="/auth/login" className="mt-4 inline-block"><Button className="rounded-full">Se connecter</Button></Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full mx-auto object-cover" />
              <h2 className="font-bold text-lg mt-3">{user.name}</h2>
              <div className="text-xs text-[#6B7B6B] mt-1">{user.email}</div>
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">{user.roles.map(r => <Badge key={r} variant="secondary" className="text-[11px]">{r}</Badge>)}</div>
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-[#6B7B6B]"><MapPin className="h-3 w-3" /> {user.city}</div>
              <Button variant="outline" className="w-full mt-4 rounded-full gap-2" onClick={() => { clearStoredUser(); window.dispatchEvent(new Event('vayeko-auth-change')); window.location.href = '/' }}><LogOut className="h-4 w-4" /> Déconnexion</Button>
            </Card>

            <Card className="p-4">
              <div className="space-y-1">
                <Link href="/commandes" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Package className="h-4 w-4" /> Commandes</span><span className="text-xs bg-[#0E9F6E] text-white px-2 py-0.5 rounded-full">3</span></Link>
                <Link href="/reservations" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4" /> Réservations</span><span className="text-xs bg-[#E8E0D0] px-2 py-0.5 rounded-full">3</span></Link>
                <Link href="/favoris" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Heart className="h-4 w-4" /> Favoris</span><span className="text-xs bg-[#E8E0D0] px-2 py-0.5 rounded-full">4</span></Link>
                <Link href="/dashboard" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Settings className="h-4 w-4" /> Dashboard vendeur</span><span className="text-xs">→</span></Link>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Informations personnelles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium">Nom complet</label><Input defaultValue={user.name} className="mt-1 rounded-full" /></div>
                <div><label className="text-xs font-medium">Email</label><Input defaultValue={user.email} className="mt-1 rounded-full" /></div>
                <div><label className="text-xs font-medium">Téléphone</label><Input defaultValue="+228 90 00 00 00" className="mt-1 rounded-full" /></div>
                <div><label className="text-xs font-medium">Ville</label><select defaultValue={user.city} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Lomé</option><option>Sokodé</option><option>Kara</option><option>Atakpamé</option><option>Kpalimé</option><option>Dapaong</option></select></div>
              </div>
              <Button className="mt-4 rounded-full">Enregistrer les modifications</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Devenir vendeur / professionnel</h3>
              <p className="text-sm text-[#6B7B6B] leading-relaxed">Vous avez déjà les rôles : {user.roles.join(', ')}. Vous pouvez créer une activité de type :</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  { type: 'Boutique', desc: 'Vendre des produits, recevoir des commandes' },
                  { type: 'Service', desc: 'Proposer des services, recevoir des réservations' },
                  { type: 'Immobilier', desc: 'Publier des biens immobiliers' },
                  { type: 'Emploi/Recrutement', desc: 'Publier des offres d\'emploi' },
                ].map(item => (
                  <div key={item.type} className="border border-[#E8E0D0] rounded-[12px] p-3 hover:border-[#0E9F6E] cursor-pointer transition-colors">
                    <div className="font-medium text-sm">{item.type}</div>
                    <div className="text-xs text-[#6B7B6B] mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
              <Button className="mt-4 rounded-full w-full">Créer une activité</Button>
            </Card>

            <Card className="p-6 bg-[#1A2E1A] text-white">
              <h3 className="font-semibold">Sécurité du compte</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">Vos données sont chiffrées. Les permissions sont vérifiées côté serveur. Les favoris sont privés par utilisateur. Les actions admin sont auditées.</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="rounded-full bg-white text-[#1A2E1A] text-xs h-8">Changer mot de passe</Button>
                <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 text-xs h-8">Historique connexions</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
