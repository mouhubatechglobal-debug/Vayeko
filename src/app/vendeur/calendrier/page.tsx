import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold capitalize">Vendeur / calendrier</h1>
        <Link href="/dashboard"><Button variant="outline" size="sm" className="rounded-full">Voir dashboard complet</Button></Link>
      </div>
      <Card className="p-12 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="font-semibold">Module calendrier</h3>
        <p className="text-sm text-[#6B7B6B] mt-1 max-w-[400px] mx-auto">Cette page /vendeur/calendrier est prévue par l'architecture Vayeko. Elle sera connectée à Supabase avec RLS : un vendeur ne peut gérer que ses propres données. Validation, upload sécurisé, audit.</p>
        <div className="mt-4 flex gap-2 justify-center">
          <Link href="/dashboard"><Button size="sm" className="rounded-full">Aller au dashboard</Button></Link>
          <Link href="/devenir-vendeur"><Button size="sm" variant="outline" className="rounded-full">Devenir vendeur</Button></Link>
        </div>
      </Card>
      <Card className="p-4 bg-[#FFFBEB] border-[#E8E0D0]">
        <h4 className="font-semibold text-sm">Sécurité RLS prévue</h4>
        <ul className="mt-2 text-xs text-[#6B7B6B] space-y-1">
          <li>✓ Vérification owner_id = auth.uid()</li>
          <li>✓ Validation type/taille/extension fichiers</li>
          <li>✓ Chemins storage sécurisés /vendeur_id/...</li>
          <li>✓ Audit admin_actions</li>
        </ul>
      </Card>
    </div>
  )
}
