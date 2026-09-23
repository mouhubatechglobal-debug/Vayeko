"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authService } from "@/services/auth"
import Link from "next/link"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    const { error } = await authService.resetPassword(email)
    
    setLoading(false)
    
    if (error) {
      setError(error)
      return
    }
    
    setMessage("Si un compte existe avec cet email, vous recevrez un lien de réinitialisation. Vérifiez votre boîte mail et spams.")
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#0E9F6E] flex items-center justify-center text-white font-bold text-lg">V</div>
            <div className="text-left"><div className="font-bold text-lg leading-none">Vayeko</div><div className="text-[10px] text-[#0E9F6E] tracking-wide">LE TOGO À PORTÉE DE MAIN</div></div>
          </Link>
          <h1 className="mt-6 text-[22px] font-bold tracking-tight">Mot de passe oublié</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.tg" className="mt-1 rounded-full h-11" required />
            </div>
            {error && <div className="text-xs text-[#E11D48] bg-[#FFE4E6] p-3 rounded-[12px]">{error}</div>}
            {message && <div className="text-xs text-[#065F46] bg-[#D1FAE5] p-3 rounded-[12px]">{message}</div>}
            <Button type="submit" disabled={loading} className="w-full rounded-full h-11">{loading ? 'Envoi...' : 'Envoyer le lien'}</Button>
          </form>

          <div className="mt-6 text-center text-xs space-y-2">
            <div><Link href="/connexion" className="text-[#0E9F6E] font-medium hover:underline">Retour à la connexion</Link></div>
            <div><Link href="/inscription" className="text-[#6B7B6B] hover:underline">Créer un compte</Link></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
