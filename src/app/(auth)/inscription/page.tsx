"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authService } from "@/services/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function InscriptionPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: 'Lomé', password: '', role: 'USER' })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (form.password.length < 8) {
      setError("Mot de passe trop court (min 8 caractères)")
      setLoading(false)
      return
    }

    const { error } = await authService.signUp(form.email, form.password, {
      full_name: form.name,
      city: form.city,
      phone: form.phone,
    })

    setLoading(false)

    if (error) {
      setError(error)
      return
    }

    router.push('/connexion')
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
          <p className="text-sm text-[#6B7B6B] mt-1">Rejoignez Vayeko en 30 secondes • Gratuit • Sécurisé Supabase</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-medium">Nom complet *</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Afi Mensah" className="mt-1 rounded-full h-11" required /></div>
              <div><label className="text-xs font-medium">Téléphone *</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+228 90 00 00 00" className="mt-1 rounded-full h-11" required /></div>
            </div>
            <div><label className="text-xs font-medium">Email *</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="vous@exemple.tg" className="mt-1 rounded-full h-11" required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-medium">Ville *</label><select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Lomé</option><option>Sokodé</option><option>Kara</option><option>Atakpamé</option><option>Kpalimé</option><option>Dapaong</option></select></div>
              <div><label className="text-xs font-medium">Vous êtes ?</label><select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option value="USER">Client</option><option value="SELLER">Vendeur</option><option value="PROFESSIONAL">Professionnel</option><option value="REAL_ESTATE_AGENT">Agent immobilier</option><option value="RECRUITER">Recruteur</option></select></div>
            </div>
            <div><label className="text-xs font-medium">Mot de passe * (min 8 caractères)</label><Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" className="mt-1 rounded-full h-11" required /></div>
            {error && <div className="text-xs text-[#E11D48] bg-[#FFE4E6] p-3 rounded-[12px]">{error}</div>}
            <div className="flex items-start gap-2 text-[11px] text-[#6B7B6B]"><input type="checkbox" required className="mt-0.5" /><span>J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité de Vayeko. RLS activé, données privées protégées.</span></div>
            <Button type="submit" disabled={loading} className="w-full rounded-full h-11">{loading ? 'Création...' : 'Créer mon compte'}</Button>
          </form>

          <div className="mt-6 text-center text-xs"><Link href="/connexion" className="text-[#0E9F6E] font-medium hover:underline">Déjà un compte ? Se connecter</Link></div>
        </Card>
      </div>
    </div>
  )
}
