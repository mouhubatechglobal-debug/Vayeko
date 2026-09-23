"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/recherche", icon: Search, label: "Recherche" },
  { href: "/favoris", icon: Heart, label: "Favoris" },
  { href: "/commandes", icon: ShoppingBag, label: "Commandes" },
  { href: "/profil", icon: User, label: "Profil" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E0D0] safe-bottom">
      <nav className="flex items-center justify-around h-[64px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px]",
                isActive ? "text-[#0E9F6E] bg-[#D1FAE5]" : "text-[#6B7B6B] hover:text-[#1A2E1A]"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
