"use client"

import { useParams } from "next/navigation"
import { services } from "@/lib/data"
import { formatPrice, generateWhatsAppLink } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, MessageCircle, Phone, Calendar } from "lucide-react"
import { useState } from "react"

export default function ServiceDetail() {
  const params = useParams()
  const id = params.id as string
  const service = services.find(s => s.id === id) || services[0]
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const whatsappMsg = `Bonjour ${service.professional.name}, je souhaite réserver ${service.title} sur Vayeko. Disponible ?`
  const waLink = generateWhatsAppLink(service.professional.whatsapp, whatsappMsg)

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-5">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] overflow-hidden">
              <div className="h-[320px] bg-[#F5F1E8]"><img src={service.images[0]} alt={service.title} className="h-full w-full object-cover" /></div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex gap-2 mb-2"><Badge>{service.category}</Badge><Badge variant={service.professional.isOpen ? 'success' : 'secondary'}>{service.professional.isOpen ? 'Ouvert' : 'Fermé'}</Badge></div>
                    <h1 className="text-[24px] font-bold leading-tight">{service.title}</h1>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[#6B7B6B]">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {service.city} • {service.professional.quartier}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[#FFB800] text-[#FFB800]" /> {service.professional.rating} ({service.professional.reviewCount} avis)</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.professional.horaires}</span>
                    </div>
                  </div>
                  <div className="text-right"><div className="text-xs text-[#6B7B6B]">{service.priceType}</div><div className="text-2xl font-bold text-[#0E9F6E]">{formatPrice(service.price)}</div></div>
                </div>
                <p className="mt-4 text-sm text-[#6B7B6B] leading-relaxed">{service.description}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-6">
              <h3 className="font-semibold mb-4">Professionnel</h3>
              <div className="flex gap-4">
                <img src={service.professional.logo} alt={service.professional.name} className="h-16 w-16 rounded-[16px] object-cover" />
                <div className="flex-1">
                  <div className="font-bold">{service.professional.name}</div>
                  <div className="text-xs text-[#6B7B6B] mt-1">{service.professional.city} • {service.professional.quartier}</div>
                  <div className="mt-2 flex gap-2">
                    <a href={waLink} target="_blank" className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-full flex items-center gap-1"><MessageCircle className="h-3 w-3" /> WhatsApp</a>
                    <span className="text-xs bg-[#FFFBEB] border border-[#E8E0D0] px-3 py-1.5 rounded-full flex items-center gap-1"><Phone className="h-3 w-3" /> {service.professional.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-[#0E9F6E]" /> Réserver ce service</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium">Date souhaitée</label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 w-full h-11 rounded-full border border-[#E8E0D0] px-4 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium">Créneau</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {['09:00', '10:30', '14:00', '15:30', '17:00', '18:30'].map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)} className={`h-9 rounded-full text-xs font-medium border ${selectedTime === t ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]' : 'bg-white border-[#E8E0D0] hover:border-[#0E9F6E]'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium">Message (optionnel)</label>
                  <textarea placeholder="Précisez votre besoin..." className="mt-1 w-full rounded-[16px] border border-[#E8E0D0] p-3 text-sm h-20 resize-none" />
                </div>
                <Button className="w-full rounded-full h-12">Demander une réservation</Button>
                <a href={waLink} target="_blank" className="block"><Button variant="whatsapp" className="w-full rounded-full h-12 gap-2"><MessageCircle className="h-4 w-4" /> Réserver sur WhatsApp</Button></a>
                <div className="text-[11px] text-[#6B7B6B] text-center">Le professionnel confirmera, refusera ou proposera un autre créneau. Vous serez notifié.</div>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#E8E0D0] rounded-[20px] p-5">
              <h4 className="font-semibold text-sm">Comment ça marche ?</h4>
              <ol className="mt-3 space-y-2 text-xs text-[#6B7B6B] list-decimal list-inside">
                <li>Vous envoyez une demande de réservation</li>
                <li>Le pro reçoit une notification</li>
                <li>Il CONFIRME, REFUSE ou MODIFIE</li>
                <li>Vous recevez une notification et pouvez le contacter</li>
                <li>Après le service, laissez un avis</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
