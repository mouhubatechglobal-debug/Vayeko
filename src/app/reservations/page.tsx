"use client"

import { services } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin, MessageCircle } from "lucide-react"
import { useState } from "react"

const mockReservations = [
  { id: 'RES-001', service: services[0], date: '2026-09-25', time: '15:00', status: 'CONFIRMED' as const, city: 'Lomé' },
  { id: 'RES-002', service: services[1], date: '2026-09-26', time: '10:30', status: 'PENDING' as const, city: 'Lomé' },
  { id: 'RES-003', service: services[2], date: '2026-09-20', time: '09:00', status: 'COMPLETED' as const, city: 'Kara' },
]

const statusMap: Record<string, { label: string, color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-[#FEF3C7] text-[#92400E]' },
  CONFIRMED: { label: 'Confirmée', color: 'bg-[#D1FAE5] text-[#065F46]' },
  REFUSED: { label: 'Refusée', color: 'bg-[#FFE4E6] text-[#9F1239]' },
  MODIFIED: { label: 'Modifiée', color: 'bg-[#DBEAFE] text-[#1E40AF]' },
  CANCELLED: { label: 'Annulée', color: 'bg-[#F5F1E8] text-[#6B7B6B]' },
  COMPLETED: { label: 'Terminée', color: 'bg-[#1A2E1A] text-white' },
}

export default function ReservationsPage() {
  const [tab, setTab] = useState<'all' | 'upcoming' | 'past'>('all')
  const filtered = mockReservations.filter(r => tab === 'all' ? true : tab === 'upcoming' ? ['PENDING', 'CONFIRMED'].includes(r.status) : ['COMPLETED', 'CANCELLED', 'REFUSED'].includes(r.status))

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2"><Calendar className="h-7 w-7" /> Mes réservations</h1>
        <p className="text-sm text-[#6B7B6B] mt-1">Gérez vos réservations de services • Confirmation par le professionnel</p>

        <div className="mt-6 flex gap-2">
          {[{ id: 'all', label: 'Toutes' }, { id: 'upcoming', label: 'À venir' }, { id: 'past', label: 'Passées' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`px-4 py-2 rounded-full text-sm font-medium border ${tab === t.id ? 'bg-[#1A2E1A] text-white border-[#1A2E1A]' : 'bg-white border-[#E8E0D0]'}`}>{t.label}</button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map(res => (
            <Card key={res.id} className="p-5">
              <div className="flex gap-4">
                <img src={res.service.images[0]} alt={res.service.title} className="h-16 w-16 rounded-[12px] object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{res.service.title}</div>
                      <div className="text-xs text-[#6B7B6B] mt-0.5">{res.service.professional.name} • {res.city}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs"><span className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-full"><Calendar className="h-3 w-3" /> {res.date}</span><span className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-full"><Clock className="h-3 w-3" /> {res.time}</span><span className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-full"><MapPin className="h-3 w-3" /> {res.city}</span></div>
                    </div>
                    <Badge className={statusMap[res.status].color}>{statusMap[res.status].label}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full gap-1.5"><MessageCircle className="h-4 w-4" /> Contacter</Button>
                    {res.status === 'PENDING' && <Button size="sm" variant="outline" className="rounded-full">Annuler</Button>}
                    {res.status === 'COMPLETED' && <Button size="sm" className="rounded-full">Laisser un avis</Button>}
                    {res.status === 'CONFIRMED' && <Button size="sm" className="rounded-full">Voir détails</Button>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
