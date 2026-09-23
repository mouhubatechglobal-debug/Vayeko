"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { getStoredUser, clearStoredUser, type UserSession } from "@/lib/auth"

export function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
    const handleStorage = () => setUser(getStoredUser())
    window.addEventListener('storage', handleStorage)
    window.addEventListener('vayeko-auth-change', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('vayeko-auth-change', handleStorage)
    }
  }, [])

  const handleLogout = () => {
    clearStoredUser()
    setUser(null)
    window.dispatchEvent(new Event('vayeko-auth-change'))
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/5">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[56px] items-center justify-between gap-4">
          {/* Logo - exact comme maquette */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-7 w-7 rounded-[8px] overflow-hidden flex items-center justify-center bg-[#0E6F4C]">
              <span className="text-[#FFB800] font-black text-[18px] leading-none">V</span>
              <div className="absolute bottom-0 right-0 h-2 w-2 bg-[#FFB800] rounded-tl-[4px]" />
            </div>
            <span className="font-extrabold text-[20px] leading-none tracking-tight text-[#0A2A12]">Vayeko</span>
          </Link>

          {/* Navigation centre - comme maquette Accueil Services Boutiques Prix Immobilier Emploi */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-[13px] font-bold text-[#0A2A12] underline underline-offset-4 decoration-2 decoration-[#0E6F4C]">Accueil</Link>
            <Link href="/services" className="text-[13px] font-medium text-[#1A2E1A]/70 hover:text-[#0A2A12] transition-colors">Services</Link>
            <Link href="/boutiques" className="text-[13px] font-medium text-[#1A2E1A]/70 hover:text-[#0A2A12] transition-colors">Boutiques</Link>
            <Link href="/prix" className="text-[13px] font-medium text-[#1A2E1A]/70 hover:text-[#0A2A12] transition-colors">Prix</Link>
            <Link href="/immobilier" className="text-[13px] font-medium text-[#1A2E1A]/70 hover:text-[#0A2A12] transition-colors">Immobilier</Link>
            <Link href="/emploi" className="text-[13px] font-medium text-[#1A2E1A]/70 hover:text-[#0A2A12] transition-colors">Emploi</Link>
          </nav>

          {/* Icônes droite - Recherche, Panier, Compte - comme maquette */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/recherche" className="h-8 w-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors">
              <Search className="h-[18px] w-[18px] text-[#0A2A12]" strokeWidth={2.5} />
            </Link>
            <Link href="/commandes" className="h-8 w-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors">
              <ShoppingCart className="h-[18px] w-[18px] text-[#0A2A12]" strokeWidth={2.5} />
            </Link>
            <Link href={user ? "/profil" : "/connexion"} className="h-8 w-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors">
              <User className="h-[18px] w-[18px] text-[#0A2A12]" strokeWidth={2.5} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-8 w-8 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-white absolute w-full left-0 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link href="/" className="block py-3 px-3 rounded-xl bg-[#FFFBEB] font-bold text-[14px]">Accueil</Link>
            <Link href="/services" className="block py-3 px-3 rounded-xl hover:bg-[#FFFBEB] font-medium text-[14px]">Services</Link>
            <Link href="/boutiques" className="block py-3 px-3 rounded-xl hover:bg-[#FFFBEB] font-medium text-[14px]">Boutiques</Link>
            <Link href="/prix" className="block py-3 px-3 rounded-xl hover:bg-[#FFFBEB] font-medium text-[14px]">Prix</Link>
            <Link href="/immobilier" className="block py-3 px-3 rounded-xl hover:bg-[#FFFBEB] font-medium text-[14px]">Immobilier</Link>
            <Link href="/emploi" className="block py-3 px-3 rounded-xl hover:bg-[#FFFBEB] font-medium text-[14px]">Emploi</Link>
            <Link href="/campus" className="block py-3 px-3 rounded-xl hover:bg-[#FFFBEB] font-medium text-[14px]">Campus</Link>
          </div>
        </div>
      )}
    </header>
  )
}
