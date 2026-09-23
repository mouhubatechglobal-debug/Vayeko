"use client"

import { useEffect, useState } from "react"
import { getStoredUser, clearStoredUser, type UserSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, LogOut, Settings, Heart, Package, Calendar, Briefcase, ShieldCheck, Store, Plus } from "lucide-react"
import Link from "next/link"
import { ProfessionSelector } from "@/components/ProfessionSelector"
import { professionCategories, professions, VerificationStatus } from "@/lib/professions"
import { toast } from "@/components/ui/toast"

export default function ProfilPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [selectedProfessionId, setSelectedProfessionId] = useState<string | null>(null)
  const [customProfession, setCustomProfession] = useState<string>("")
  const [professionalProfiles, setProfessionalProfiles] = useState<any[]>([
    { id: '1', profession_id: 'coiffeur', custom_profession: null, verification_status: VerificationStatus.VERIFIE, description: 'Coiffure homme/femme depuis 5 ans à Tokoin', experience: '5 ans' },
  ])

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
          <Link href="/connexion" className="mt-4 inline-block"><Button className="rounded-full">Se connecter</Button></Link>
        </Card>
      </div>
    )
  }

  const handleAddProfession = () => {
    if (!selectedProfessionId) {
      toast('Veuillez sélectionner une profession', 'error')
      return
    }
    if (selectedProfessionId === 'autre' && customProfession.trim().length < 2) {
      toast('Veuillez saisir votre profession', 'error')
      return
    }
    
    const newProfile = {
      id: `pro-${Date.now()}`,
      profession_id: selectedProfessionId === 'autre' ? null : selectedProfessionId,
      custom_profession: selectedProfessionId === 'autre' ? customProfession : null,
      verification_status: VerificationStatus.NON_VERIFIE,
      description: '',
      experience: '',
    }
    
    setProfessionalProfiles([...professionalProfiles, newProfile])
    setSelectedProfessionId(null)
    setCustomProfession("")
    toast('Profession ajoutée ! Vous pouvez demander vérification', 'success')
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-[#E8E0D0]" />
              <h2 className="font-bold text-lg mt-3">{user.name}</h2>
              <div className="text-xs text-[#6B7B6B] mt-1">{user.email}</div>
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {user.roles.map(r => <Badge key={r} variant="secondary" className="text-[11px] font-bold">{r}</Badge>)}
                </div>
                <div className="text-[11px] text-[#6B7B6B] bg-[#FFFBEB] p-2 rounded-[10px]">Rôle = ce que vous POUVEZ faire sur Vayeko<br/>Profession = ce que vous FAITES</div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-[#6B7B6B]"><MapPin className="h-3 w-3" /> {user.city}</div>
              <Button variant="outline" className="w-full mt-4 rounded-full gap-2" onClick={() => { clearStoredUser(); window.dispatchEvent(new Event('vayeko-auth-change')); window.location.href = '/' }}><LogOut className="h-4 w-4" /> Déconnexion</Button>
            </Card>

            <Card className="p-4">
              <h4 className="font-bold text-sm mb-3">Mon activité Vayeko</h4>
              <div className="space-y-1">
                <Link href="/commandes" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Package className="h-4 w-4" /> Commandes</span><span className="text-xs bg-[#0E9F6E] text-white px-2 py-0.5 rounded-full">3</span></Link>
                <Link href="/mes-reservations" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4" /> Réservations</span><span className="text-xs bg-[#E8E0D0] px-2 py-0.5 rounded-full">3</span></Link>
                <Link href="/favoris" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Heart className="h-4 w-4" /> Favoris</span><span className="text-xs bg-[#E8E0D0] px-2 py-0.5 rounded-full">4</span></Link>
                <Link href="/vendeur" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB] bg-[#D1FAE5]/50"><span className="flex items-center gap-2 text-sm font-bold"><Store className="h-4 w-4" /> Espace vendeur</span><span className="text-xs">→</span></Link>
                <Link href="/notifications" className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#FFFBEB]"><span className="flex items-center gap-2 text-sm"><Settings className="h-4 w-4" /> Notifications</span><span className="text-xs bg-[#E11D48] text-white px-2 py-0.5 rounded-full">2</span></Link>
              </div>
            </Card>

            <Card className="p-4 bg-[#1A2E1A] text-white">
              <h4 className="font-bold text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#86EFAC]" /> Sécurité</h4>
              <ul className="mt-3 text-[11px] text-white/70 space-y-1.5 leading-relaxed">
                <li>✓ Rôles vérifiés côté serveur + RLS</li>
                <li>✓ Pas de email = admin (RBAC)</li>
                <li>✓ Favoris privés par user</li>
                <li>✓ Audit admin_actions</li>
                <li>✓ USER peut acheter sans SELLER</li>
              </ul>
            </Card>
          </div>

          {/* Main */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-[16px] mb-1">Identité + Profil</h3>
              <p className="text-xs text-[#6B7B6B] mb-4">Informations personnelles — modifiables</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold">Nom complet</label><Input defaultValue={user.name} className="mt-1 rounded-full" /></div>
                <div><label className="text-xs font-bold">Email</label><Input defaultValue={user.email} className="mt-1 rounded-full" /></div>
                <div><label className="text-xs font-bold">Téléphone</label><Input defaultValue="+228 90 00 00 00" className="mt-1 rounded-full" /></div>
                <div><label className="text-xs font-bold">Ville</label><select defaultValue={user.city} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Lomé</option><option>Sokodé</option><option>Kara</option><option>Atakpamé</option><option>Kpalimé</option><option>Dapaong</option></select></div>
              </div>
              <Button className="mt-4 rounded-full">Enregistrer</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-[16px] mb-1 flex items-center gap-2"><Briefcase className="h-5 w-5 text-[#0E9F6E]" /> Rôles — Ce que vous POUVEZ faire sur Vayeko</h3>
              <p className="text-xs text-[#6B7B6B] mb-4">Un même compte peut avoir plusieurs rôles : USER + SELLER, USER + PROFESSIONAL, USER + SELLER + PROFESSIONAL, etc. Ne pas enfermer dans une seule catégorie.</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { role: 'USER', desc: 'Acheter, réserver, favoris, avis — par défaut', active: user.roles.includes('USER') },
                  { role: 'SELLER', desc: 'Boutique, produits, commandes', active: user.roles.includes('SELLER') },
                  { role: 'PROFESSIONAL', desc: 'Services, réservations', active: user.roles.includes('PROFESSIONAL') },
                  { role: 'REAL_ESTATE_AGENT', desc: 'Immobilier', active: user.roles.includes('REAL_ESTATE_AGENT') },
                  { role: 'RECRUITER', desc: 'Emploi, recrutement', active: user.roles.includes('RECRUITER') },
                  { role: 'ADMIN', desc: 'Administration', active: user.roles.includes('ADMIN') },
                ].map(item => (
                  <div key={item.role} className={`border rounded-[12px] p-3 flex-1 min-w-[180px] ${item.active ? 'bg-[#D1FAE5] border-[#86EFAC]' : 'bg-white border-[#E8E0D0]'}`}>
                    <div className="flex items-center gap-2"><Badge variant={item.active ? 'success' : 'secondary'} className="text-[11px] font-bold">{item.role}</Badge> {item.active && <Check className="h-4 w-4 text-[#0E9F6E]" />}</div>
                    <div className="text-[11px] text-[#6B7B6B] mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#FFFBEB] p-3 rounded-[12px] text-xs">
                <div className="font-bold">Exemple polyvalent :</div>
                <div className="text-[#6B7B6B] mt-1">Mécanicien = USER + PROFESSIONAL • Boutique = USER + SELLER • Restaurateur = USER + SELLER + PROFESSIONAL • Agent immo = USER + REAL_ESTATE_AGENT • Peut cumuler.</div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-[16px] mb-1">Professions — Ce que vous FAITES dans la vie</h3>
              <p className="text-xs text-[#6B7B6B] mb-4">Structure évolutive : professions (id, name, slug, category_id, icon, requires_verification) + profession_categories + professional_profiles. Ajout sans modifier cœur.</p>
              
              <div className="space-y-3 mb-6">
                {professionalProfiles.map((pp, idx) => {
                  const prof = professions.find(p => p.id === pp.profession_id)
                  const cat = prof ? professionCategories.find(c => c.id === prof.categoryId) : null
                  return (
                    <div key={idx} className="border border-[#E8E0D0] rounded-[12px] p-3 flex items-start justify-between gap-3 bg-white">
                      <div className="flex gap-2.5">
                        <span className="text-xl">{prof?.icon || '➕'}</span>
                        <div>
                          <div className="font-bold text-sm">{prof?.name || pp.custom_profession || 'Profession personnalisée'}</div>
                          <div className="text-[11px] text-[#6B7B6B] mt-0.5">{prof?.description || 'Saisie libre, modération admin'} • {cat?.name || 'Autre'}</div>
                          <div className="flex gap-1.5 mt-2">
                            <Badge className={
                              pp.verification_status === VerificationStatus.VERIFIE ? 'bg-[#D1FAE5] text-[#065F46]' :
                              pp.verification_status === VerificationStatus.EN_VERIFICATION ? 'bg-[#FEF3C7] text-[#92400E]' :
                              pp.verification_status === VerificationStatus.REJETE ? 'bg-[#FFE4E6] text-[#9F1239]' :
                              'bg-[#F5F1E8] text-[#6B7B6B]'
                            }>{pp.verification_status}</Badge>
                            {prof?.requiresVerification && <Badge variant="secondary" className="text-[10px] bg-[#FFE4E6] text-[#9F1239]">Vérif. requise</Badge>}
                          </div>
                          {pp.description && <div className="text-xs text-[#6B7B6B] mt-2">{pp.description}</div>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-full text-xs h-7">Modifier</Button>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-[#F5F1E8] pt-4">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Plus className="h-4 w-4" /> Ajouter une profession</h4>
                <ProfessionSelector
                  selectedProfessionId={selectedProfessionId || undefined}
                  customProfession={customProfession}
                  onSelect={(id, custom) => {
                    setSelectedProfessionId(id)
                    if (custom) setCustomProfession(custom)
                  }}
                />
                <Button className="mt-4 rounded-full" onClick={handleAddProfession}>Ajouter cette profession</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-[16px] mb-1">Activités & Boutique</h3>
              <p className="text-xs text-[#6B7B6B] mb-4">USER peut acheter sans devenir SELLER. Ex: USER achète téléphone, reste USER. Plus tard crée boutique → SELLER, cumule USER+SELLER+PROFESSIONAL.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { type: 'Boutique', desc: 'Vendre produits, recevoir commandes', roles: ['SELLER'] },
                  { type: 'Service', desc: 'Proposer services, réservations', roles: ['PROFESSIONAL'] },
                  { type: 'Immobilier', desc: 'Publier biens', roles: ['REAL_ESTATE_AGENT'] },
                  { type: 'Emploi', desc: 'Publier offres', roles: ['RECRUITER'] },
                ].map(item => (
                  <div key={item.type} className="border border-[#E8E0D0] rounded-[12px] p-3 hover:border-[#0E9F6E] cursor-pointer transition-colors bg-white">
                    <div className="font-bold text-sm">{item.type}</div>
                    <div className="text-xs text-[#6B7B6B] mt-1">{item.desc}</div>
                    <div className="flex gap-1 mt-2">{item.roles.map(r => <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>)}</div>
                  </div>
                ))}
              </div>
              <Button className="mt-4 rounded-full w-full">Créer une activité</Button>
            </Card>

            <Card className="p-6 bg-[#1A2E1A] text-white">
              <h3 className="font-bold">Compte complet Vayeko</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">Identité + Profil + Rôles + Profession(s) + Activité(s) + Boutique(s) + Services + Produits + Commandes + Réservations + Avis + Favoris + Notifications. Architecture évolutive sans réécrire app.</p>
              <div className="mt-3 text-[11px] text-white/50">15 catégories pro, 100+ professions, custom profession avec modération, vérification NON_VÉRIFIÉ/EN_VÉRIFICATION/VÉRIFIÉ/REJETÉ jamais auto, admin gère, santé/juridique vérif requise, RLS, RBAC avec user_roles + custom claims.</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Check({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5l10 -10" /></svg>
}
