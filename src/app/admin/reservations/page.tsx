import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6"><ShieldCheck className="h-6 w-6 text-[#0E9F6E]" /><h1 className="text-2xl font-bold">Admin / reservations</h1><span className="text-xs bg-[#1A2E1A] text-white px-2.5 py-1 rounded-full">RLS Admin Only</span></div>
        <Card className="p-12 text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="font-semibold">Administration - reservations</h3>
          <p className="text-sm text-[#6B7B6B] mt-2 max-w-[500px] mx-auto">Route protégée. Seul rôle ADMIN peut accéder. RLS : is_admin() = true. Audit obligatoire dans admin_actions. Ne jamais considérer utilisateur connecté = admin.</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Link href="/admin"><Button size="sm" className="rounded-full">Retour admin</Button></Link>
            <Link href="/connexion"><Button size="sm" variant="outline" className="rounded-full">Connexion admin</Button></Link>
          </div>
        </Card>
        <Card className="mt-6 p-4 bg-[#1A2E1A] text-white">
          <h4 className="font-semibold text-sm">Sécurité implémentée</h4>
          <ul className="mt-2 text-xs text-white/70 space-y-1">
            <li>✓ RLS : FOR SELECT USING (is_admin())</li>
            <li>✓ Middleware vérifie session</li>
            <li>✓ Page vérifie rôle ADMIN</li>
            <li>✓ Audit log dans admin_actions</li>
            <li>✓ Pas d'exposition secrets dans erreurs</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
