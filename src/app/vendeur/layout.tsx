import Link from "next/link"
import { Store, Package, Calendar, DollarSign, BarChart3, Star, Settings, ShoppingBag, Clock } from "lucide-react"

const navItems = [
  { href: '/vendeur', label: 'Vue d\'ensemble', icon: BarChart3 },
  { href: '/vendeur/boutique', label: 'Ma boutique', icon: Store },
  { href: '/vendeur/produits', label: 'Produits', icon: Package },
  { href: '/vendeur/services', label: 'Services', icon: ShoppingBag },
  { href: '/vendeur/commandes', label: 'Commandes', icon: Package },
  { href: '/vendeur/reservations', label: 'Réservations', icon: Calendar },
  { href: '/vendeur/calendrier', label: 'Calendrier', icon: Clock },
  { href: '/vendeur/revenus', label: 'Revenus', icon: DollarSign },
  { href: '/vendeur/statistiques', label: 'Statistiques', icon: BarChart3 },
  { href: '/vendeur/avis', label: 'Avis', icon: Star },
  { href: '/vendeur/parametres', label: 'Paramètres', icon: Settings },
]

export default function VendeurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-[#1A2E1A] text-white py-4">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="font-bold">Espace Vendeur Vayeko</div>
          <Link href="/dashboard" className="text-xs bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/15">Dashboard complet →</Link>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <div className="hidden lg:block">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[16px] p-2 sticky top-[120px]">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-sm hover:bg-[#FFFBEB] transition-colors">
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
