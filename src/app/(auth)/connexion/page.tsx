"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authService } from "@/services/auth"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ConnexionContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await authService.signIn(email, password)
    
    setLoading(false)
    
    if (error) {
      setError(error)
      return
    }
    
    router.push(redirect)
  }

  const fillDemo = (type: 'client' | 'vendeur' | 'pro' | 'admin') => {
    const map = {
      client: { email: 'client@vayeko.tg', password: 'client123' },
      vendeur: { email: 'vendeur@vayeko.tg', password: 'vendeur123' },
      pro: { email: 'pro@vayeko.tg', password: 'pro123' },
      admin: { email: 'admin@vayeko.tg', password: 'admin123' },
    }
    setEmail(map[type].email)
    setPassword(map[type].password)
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#0E9F6E] flex items-center justify-center text-white font-bold text-lg">V</div>
            <div className="text-left"><div className="font-bold text-lg leading-none">Vayeko</div><div className="text-[10px] text-[#0E9F6E] tracking-wide">LE TOGO À PORTÉE DE MAIN</div></div>
          </Link>
          <h1 className="mt-6 text-[26px] font-bold tracking-tight">Connexion</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Accédez à votre espace Vayeko • Sécurisé par Supabase Auth</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.tg" className="mt-1 rounded-full h-11" required />
            </div>
            <div>
              <label className="text-xs font-medium">Mot de passe</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 rounded-full h-11" required />
            </div>
            {error && <div className="text-xs text-[#E11D48] bg-[#FFE4E6] p-3 rounded-[12px]">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full rounded-full h-11">{loading ? 'Connexion...' : 'Se connecter'}</Button>
          </form>

          <div className="mt-6">
            <div className="text-xs font-medium text-[#6B7B6B] mb-2">Comptes démo (cliquez pour remplir) :</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => fillDemo('client')} className="text-xs p-2.5 rounded-[12px] border border-[#E8E0D0] hover:border-[#0E9F6E] text-left"><div className="font-medium">Client</div><div className="text-[#6B7B6B]">client@vayeko.tg</div></button>
              <button onClick={() => fillDemo('vendeur')} className="text-xs p-2.5 rounded-[12px] border border-[#E8E0D0] hover:border-[#0E9F6E] text-left"><div className="font-medium">Vendeur</div><div className="text-[#6B7B6B]">vendeur@vayeko.tg</div></button>
              <button onClick={() => fillDemo('pro')} className="text-xs p-2.5 rounded-[12px] border border-[#E8E0D0] hover:border-[#0E9F6E] text-left"><div className="font-medium">Professionnel</div><div className="text-[#6B7B6B]">pro@vayeko.tg</div></button>
              <button onClick={() => fillDemo('admin')} className="text-xs p-2.5 rounded-[12px] border border-[#E8E0D0] hover:border-[#0E9F6E] text-left"><div className="font-medium">Admin</div><div className="text-[#6B7B6B]">admin@vayeko.tg</div></button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs space-y-2">
            <div><Link href="/inscription" className="text-[#0E9F6E] font-medium hover:underline">Pas encore de compte ? S&apos;inscrire</Link></div>
            <div><Link href="/mot-de-passe-oublie" className="text-[#6B7B6B] hover:underline">Mot de passe oublié ?</Link></div>
            <div className="pt-2 border-t border-[#F5F1E8]"><Link href="/auth/login" className="text-[#9CA99C] hover:underline text-[11px]">Ancienne page /auth/login (compatibilité)</Link></div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ConnexionContent />
    </Suspense>
  )
}
