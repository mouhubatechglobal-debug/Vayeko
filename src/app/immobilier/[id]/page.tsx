"use client"

import { useParams } from "next/navigation"
import { properties } from "@/lib/data"
import { formatPrice, generateWhatsAppLink } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Square, Phone, MessageCircle } from "lucide-react"

export default function ImmoDetail() {
  const params = useParams()
  const id = params.id as string
  const prop = properties.find(p => p.id === id) || properties[0]
  const waLink = generateWhatsAppLink(prop.agent.whatsapp, `Bonjour, je suis intéressé par ${prop.title} à ${formatPrice(prop.price)} sur Vayeko.`)

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-4">
            <div className="aspect-[16/10] rounded-[20px] overflow-hidden bg-[#F5F1E8]"><img src={prop.photos[0]} alt={prop.title} className="h-full w-full object-cover" /></div>
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-6">
              <div className="flex gap-2 mb-3"><Badge className="bg-[#06B6D4]">{prop.type}</Badge><Badge variant="secondary">{prop.status}</Badge></div>
              <h1 className="text-[26px] font-bold leading-tight">{prop.title}</h1>
              <div className="mt-2 flex gap-3 text-sm text-[#6B7B6B]"><span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {prop.city} • {prop.quartier}</span><span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {prop.pieces} pièces</span><span className="flex items-center gap-1"><Square className="h-4 w-4" /> {prop.superficie}m²</span></div>
              <p className="mt-4 text-sm text-[#6B7B6B] leading-relaxed">{prop.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">{prop.features.map(f => <span key={f} className="text-xs bg-[#FFFBEB] border border-[#E8E0D0] px-3 py-1 rounded-full">{f}</span>)}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-6">
              <div className="text-3xl font-bold text-[#06B6D4]">{formatPrice(prop.price)} <span className="text-sm font-normal text-[#6B7B6B]">{prop.priceType}</span></div>
              <div className="mt-6 space-y-3">
                <div className="flex gap-3 p-3 bg-[#FFFBEB] rounded-[12px]"><img src="https://i.pravatar.cc/100?img=15" alt="" className="h-10 w-10 rounded-full" /><div><div className="font-semibold text-sm">{prop.agent.name}</div><div className="text-xs text-[#6B7B6B]">Agent • {prop.city}</div></div></div>
                <a href={waLink} target="_blank"><Button variant="whatsapp" className="w-full rounded-full h-12 gap-2"><MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp</Button></a>
                <a href={`tel:${prop.agent.phone}`}><Button variant="outline" className="w-full rounded-full h-12 gap-2"><Phone className="h-4 w-4" /> Appeler {prop.agent.phone}</Button></a>
                <Button className="w-full rounded-full h-12 bg-[#06B6D4] hover:bg-[#0891B2]">Demander une visite</Button>
              </div>
            </div>
            <div className="bg-[#1A2E1A] text-white rounded-[20px] p-5">
              <h4 className="font-semibold">Conseils Vayeko</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-[#A8C5A8]"><li>• Visitez toujours le bien avant paiement</li><li>• Vérifiez les documents (titre foncier)</li><li>• Ne payez jamais 100% à l&apos;avance</li><li>• Signalez toute annonce suspecte</li></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
