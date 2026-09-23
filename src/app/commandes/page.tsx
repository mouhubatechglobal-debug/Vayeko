"use client"

import { products } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Package, Clock, MapPin, MessageCircle } from "lucide-react"
import { useState } from "react"

const mockOrders = [
  { id: 'CMD-2026-001', product: products[0], quantity: 1, total: 185000, status: 'CONFIRMED' as const, date: new Date('2026-09-21'), city: 'Lomé', history: [{ status: 'NEW', date: '21 sept 10:00' }, { status: 'CONFIRMED', date: '21 sept 11:30' }] },
  { id: 'CMD-2026-002', product: products[2], quantity: 2, total: 50000, status: 'PREPARING' as const, date: new Date('2026-09-20'), city: 'Lomé', history: [{ status: 'NEW', date: '20 sept 14:00' }, { status: 'CONFIRMED', date: '20 sept 15:00' }, { status: 'PREPARING', date: '21 sept 09:00' }] },
  { id: 'CMD-2026-003', product: products[5], quantity: 1, total: 6500, status: 'DELIVERED' as const, date: new Date('2026-09-18'), city: 'Sokodé', history: [{ status: 'NEW', date: '18 sept 09:00' }, { status: 'CONFIRMED', date: '18 sept 10:00' }, { status: 'PREPARING', date: '18 sept 11:00' }, { status: 'READY', date: '19 sept 08:00' }, { status: 'DELIVERED', date: '19 sept 16:00' }] },
]

const statusLabels: Record<string, { label: string, color: string }> = {
  NEW: { label: 'Nouvelle', color: 'bg-[#FEF3C7] text-[#92400E]' },
  CONFIRMED: { label: 'Confirmée', color: 'bg-[#DBEAFE] text-[#1E40AF]' },
  PREPARING: { label: 'En préparation', color: 'bg-[#EDE9FE] text-[#6D28D9]' },
  READY: { label: 'Prête', color: 'bg-[#CFFAFE] text-[#155E75]' },
  DELIVERED: { label: 'Livrée', color: 'bg-[#D1FAE5] text-[#065F46]' },
  COMPLETED: { label: 'Terminée', color: 'bg-[#D1FAE5] text-[#065F46]' },
  CANCELLED: { label: 'Annulée', color: 'bg-[#FFE4E6] text-[#9F1239]' },
}

export default function CommandesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all')
  const filtered = mockOrders.filter(o => activeTab === 'all' ? true : activeTab === 'active' ? !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(o.status) : ['DELIVERED', 'COMPLETED'].includes(o.status))

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2"><Package className="h-7 w-7" /> Mes commandes</h1>
        <p className="text-sm text-[#6B7B6B] mt-1">Suivez l&apos;évolution de vos commandes • Historique complet</p>

        <div className="mt-6 flex gap-2">
          {[{ id: 'all', label: 'Toutes' }, { id: 'active', label: 'En cours' }, { id: 'delivered', label: 'Livrées' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-full text-sm font-medium border ${activeTab === tab.id ? 'bg-[#1A2E1A] text-white border-[#1A2E1A]' : 'bg-white border-[#E8E0D0] hover:border-[#1A2E1A]'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map(order => (
            <Card key={order.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <img src={order.product.images[0]} alt={order.product.name} className="h-16 w-16 rounded-[12px] object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{order.product.name}</div>
                    <div className="text-xs text-[#6B7B6B] mt-0.5">{order.product.shopName} • Qté: {order.quantity} • {formatPrice(order.total)}</div>
                    <div className="text-xs text-[#6B7B6B] flex items-center gap-2 mt-1"><MapPin className="h-3 w-3" /> {order.city} • <Clock className="h-3 w-3" /> {order.date.toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <Badge className={statusLabels[order.status].color}>{statusLabels[order.status].label}</Badge>
              </div>

              <div className="mt-4">
                <div className="text-xs font-medium mb-2">Suivi</div>
                <div className="flex gap-2 overflow-x-auto">
                  {['NEW', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED'].map((s, idx) => {
                    const isDone = order.history.some(h => h.status === s)
                    const isCurrent = order.status === s
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${isDone ? 'bg-[#0E9F6E] text-white' : 'bg-[#F5F1E8] text-[#9CA99C]'} ${isCurrent ? 'ring-2 ring-[#0E9F6E] ring-offset-2' : ''}`}>{idx + 1}</div>
                        <div className={`text-[11px] whitespace-nowrap ${isDone ? 'text-[#1A2E1A] font-medium' : 'text-[#9CA99C]'}`}>{statusLabels[s]?.label || s}</div>
                        {idx < 5 && <div className={`h-0.5 w-6 ${isDone ? 'bg-[#0E9F6E]' : 'bg-[#E8E0D0]'}`} />}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 bg-[#FFFBEB] rounded-[12px] p-3 text-xs">
                  <div className="font-medium">Historique</div>
                  <div className="mt-1 space-y-1">
                    {order.history.map((h, i) => (
                      <div key={i} className="flex justify-between"><span>{statusLabels[h.status]?.label || h.status}</span><span className="text-[#6B7B6B]">{h.date}</span></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full gap-1.5"><MessageCircle className="h-4 w-4" /> Contacter vendeur</Button>
                <Button size="sm" variant="outline" className="rounded-full">Voir détails</Button>
                {order.status === 'DELIVERED' && <Button size="sm" className="rounded-full">Laisser un avis</Button>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
