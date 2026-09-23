"use client"

import { useParams } from "next/navigation"
import { listings } from "@/lib/data"
import { formatPrice, generateWhatsAppLink, formatRelativeTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageCircle, Phone } from "lucide-react"

export default function AnnonceDetail() {
  const params = useParams()
  const id = params.id as string
  const ann = listings.find(a => a.id === id) || listings[0]
  const waLink = generateWhatsAppLink(ann.phone, `Bonjour, votre annonce "${ann.title}" à ${formatPrice(ann.price)} sur Vayeko m'intéresse. Disponible ?`)

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-[20px] overflow-hidden bg-[#F5F1E8]"><img src={ann.images[0]} alt={ann.title} className="h-full w-full object-cover" /></div>
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-6">
              <div className="flex gap-2 mb-3"><Badge>{ann.category}</Badge><Badge variant={ann.status === 'ACTIVE' ? 'success' : 'secondary'}>{ann.status}</Badge></div>
              <h1 className="text-[22px] font-bold leading-tight">{ann.title}</h1>
              <div className="mt-2 text-xs text-[#6B7B6B] flex items-center gap-2"><MapPin className="h-3 w-3" /> {ann.city} • {ann.quartier} • Publié {formatRelativeTime(ann.createdAt)} • Par {ann.seller}</div>
              <p className="mt-4 text-sm text-[#6B7B6B] leading-relaxed">{ann.description}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-6">
              <div className="text-2xl font-bold">{formatPrice(ann.price)}</div>
              <div className="mt-5 space-y-3">
                <a href={waLink} target="_blank"><Button variant="whatsapp" className="w-full rounded-full h-12 gap-2"><MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp</Button></a>
                <a href={`tel:${ann.phone}`}><Button variant="outline" className="w-full rounded-full h-12 gap-2"><Phone className="h-4 w-4" /> Appeler {ann.phone}</Button></a>
                <Button className="w-full rounded-full h-12">Faire une offre</Button>
              </div>
              <div className="mt-4 p-3 bg-[#FFFBEB] rounded-[12px] text-[11px] text-[#6B7B6B] leading-relaxed">⚠️ Conseils sécurité : Rencontrez-vous dans un lieu public, vérifiez le produit avant paiement, ne payez jamais à l&apos;avance par Flooz/TMoney sans voir le produit.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
