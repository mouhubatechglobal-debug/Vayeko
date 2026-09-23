"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { storeUser } from "@/lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: 'Lomé', password: '', role: 'USER' })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = { id: `user-${Date.now()}`, email: form.email, name: form.name, roles: form.role === 'USER' ? ['USER'] : ['USER', form.role], city: form.city, avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random()*20)+1}` }
    storeUser(newUser)
    window.dispatchEvent(new Event('vayeko-auth-change'))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#0E9F6E] flex items-center justify-center text-white font-bold text-lg">V</div>
            <div className="text-left"><div className="font-bold text-lg leading-none">Vayeko</div><div className="text-[10px] text-[#0E9F6E] tracking-wide">LE TOGO À PORTÉE DE MAIN</div></div>
          </Link>
          <h1 className="mt-6 text-[26px] font-bold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Rejoignez Vayeko en 30 secondes • Gratuit</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-medium">Nom complet</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Afi Mensah" className="mt-1 rounded-full h-11" required /></div>
              <div><label className="text-xs font-medium">Téléphone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+228 90 00 00 00" className="mt-1 rounded-full h-11" required /></div>
            </div>
            <div><label className="text-xs font-medium">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="vous@exemple.tg" className="mt-1 rounded-full h-11" required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-medium">Ville</label><select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Lomé</option><option>Sokodé</option><option>Kara</option><option>Atakpamé</option><option>Kpalimé</option><option>Dapaong</option></select></div>
              <div><label className="text-xs font-medium">Vous êtes ?</label><select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option value="USER">Client (acheter, réserver)</option><option value="SELLER">Vendeur (boutique)</option><option value="PROFESSIONAL">Professionnel (services)</option><option value="REAL_ESTATE_AGENT">Agent immobilier</option><option value="RECRUITER">Recruteur</option></select></div>
            </div>
            <div><label className="text-xs font-medium">Mot de passe</label><Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min. 8 caractères" className="mt-1 rounded-full h-11" required /></div>
            <div className="flex items-start gap-2 text-[11px] text-[#6B7B6B]"><input type="checkbox" required className="mt-0.5" /><span>J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité de Vayeko. Mes données sont protégées.</span></div>
            <Button type="submit" className="w-full rounded-full h-11">Créer mon compte</Button>
          </form>

          <div className="mt-6 text-center text-xs"><Link href="/auth/login" className="text-[#0E9F6E] font-medium hover:underline">Déjà un compte ? Se connecter</Link></div>

          <div className="mt-6 bg-[#FFFBEB] border border-[#E8E0D0] rounded-[12px] p-3 text-[11px] text-[#6B7B6B] leading-relaxed">
            <div className="font-medium text-[#1A2E1A] mb-1">Pourquoi créer un compte ?</div>
            <ul className="list-disc list-inside space-y-0.5"><li>Commander et suivre vos commandes</li><li>Réserver des services en 1 clic</li><li>Ajouter aux favoris (privé)</li><li>Laisser des avis vérifiés</li><li>Devenir vendeur/professionnel</li></ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
