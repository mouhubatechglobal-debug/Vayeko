"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Package, Calendar, Star, MessageCircle, CheckCheck } from "lucide-react"

const mockNotifications = [
  { id: '1', type: 'NEW_ORDER', title: 'Nouvelle commande', message: 'Commande CMD-001 - Samsung Galaxy A55 par Afi M.', isRead: false, time: 'Il y a 10 min', icon: Package, color: 'bg-[#D1FAE5] text-[#065F46]' },
  { id: '2', type: 'RESERVATION', title: 'Demande de réservation', message: 'Komi D. souhaite réserver Coiffure Homme vendredi 15h', isRead: false, time: 'Il y a 1h', icon: Calendar, color: 'bg-[#CFFAFE] text-[#155E75]' },
  { id: '3', type: 'REVIEW', title: 'Nouvel avis 5 étoiles', message: 'Afi M. a laissé un avis : Service impeccable !', isRead: true, time: 'Il y a 3h', icon: Star, color: 'bg-[#FEF3C7] text-[#92400E]' },
  { id: '4', type: 'MESSAGE', title: 'Message WhatsApp', message: 'Nouveau message de Jean K. concernant Moto Haojue', isRead: true, time: 'Il y a 5h', icon: MessageCircle, color: 'bg-[#25D366]/20 text-[#128C7E]' },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.isRead)
  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllRead = () => {
    setNotifications(notifs => notifs.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2"><Bell className="h-7 w-7" /> Notifications {unreadCount > 0 && <Badge className="bg-[#E11D48]">{unreadCount}</Badge>}</h1>
            <p className="text-sm text-[#6B7B6B] mt-1">Restez informé de votre activité Vayeko</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={markAllRead}><CheckCheck className="h-4 w-4" /> Tout marquer lu</Button>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === 'all' ? 'bg-[#1A2E1A] text-white border-[#1A2E1A]' : 'bg-white border-[#E8E0D0]'}`}>Toutes ({notifications.length})</button>
          <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === 'unread' ? 'bg-[#1A2E1A] text-white border-[#1A2E1A]' : 'bg-white border-[#E8E0D0]'}`}>Non lues ({unreadCount})</button>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map(notif => (
            <Card key={notif.id} className={`p-4 flex gap-3 ${!notif.isRead ? 'border-[#0E9F6E]/30 bg-[#D1FAE5]/20' : ''}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}><notif.icon className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm">{notif.title} {!notif.isRead && <span className="h-2 w-2 bg-[#0E9F6E] rounded-full inline-block ml-1" />}</div>
                  <span className="text-[11px] text-[#6B7B6B] whitespace-nowrap">{notif.time}</span>
                </div>
                <div className="text-xs text-[#6B7B6B] mt-1 leading-relaxed">{notif.message}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 rounded-full text-xs">Voir</Button>
                  {!notif.isRead && <Button size="sm" variant="ghost" className="h-7 rounded-full text-xs" onClick={() => setNotifications(n => n.map(x => x.id === notif.id ? { ...x, isRead: true } : x))}>Marquer lu</Button>}
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <div className="font-medium">Aucune notification {filter === 'unread' ? 'non lue' : ''}</div>
              <div className="text-xs text-[#6B7B6B] mt-1">Vous êtes à jour !</div>
            </Card>
          )}
        </div>

        <Card className="mt-8 p-4 bg-[#1A2E1A] text-white">
          <h3 className="font-semibold text-sm">Types de notifications Vayeko</h3>
          <ul className="mt-2 text-xs text-white/70 space-y-1 leading-relaxed">
            <li>• Nouvelle commande / changement statut commande</li>
            <li>• Demande réservation / changement réservation</li>
            <li>• Nouveau message important / WhatsApp</li>
            <li>• Nouvel avis / réponse à avis</li>
            <li>• Activité compte / sécurité</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
