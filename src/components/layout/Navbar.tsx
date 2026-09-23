"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <header className="sticky top-0 z-50 w-full bg-[#FFFEFB]/95 backdrop-blur-xl border-b border-[#E8E0D0]/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between gap-4">
          {/* Logo - Symbole vert/jaune + texte Vayeko sombre */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0E9F6E] to-[#065F46]" />
              <div className="absolute top-0 right-0 h-3 w-3 bg-[#FFB800] rounded-bl-[8px]" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-[18px] tracking-tight">V</div>
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold text-[20px] leading-none tracking-tight text-[#0A2A12]">Vayeko</div>
            </div>
          </Link>

          {/* Navigation centre - Accueil, Services, Boutiques, Prix, Immobilier, Emploi */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3.5 py-2 text-[14px] font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Accueil</Link>
            <Link href="/services" className="px-3.5 py-2 text-[14px] font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Services</Link>
            <Link href="/boutiques" className="px-3.5 py-2 text-[14px] font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Boutiques</Link>
            <Link href="/prix" className="px-3.5 py-2 text-[14px] font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Prix</Link>
            <Link href="/immobilier" className="px-3.5 py-2 text-[14px] font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Immobilier</Link>
            <Link href="/emploi" className="px-3.5 py-2 text-[14px] font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Emploi</Link>
          </nav>

          {/* Icônes droite - Recherche, Panier, Compte */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Link href="/recherche" className="h-10 w-10 rounded-full hover:bg-[#FFFBEB] flex items-center justify-center transition-colors">
              <Search className="h-5 w-5 text-[#1A2E1A]" />
            </Link>
            <Link href="/favoris" className="relative h-10 w-10 rounded-full hover:bg-[#FFFBEB] flex items-center justify-center transition-colors hidden sm:flex">
              <Heart className="h-5 w-5 text-[#1A2E1A]" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#E11D48]">2</Badge>
            </Link>
            <Link href="/commandes" className="relative h-10 w-10 rounded-full hover:bg-[#FFFBEB] flex items-center justify-center transition-colors">
              <ShoppingBag className="h-5 w-5 text-[#1A2E1A]" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">1</Badge>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#E8E0D0]/60 ml-2">
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  <div className="hidden xl:block text-left leading-tight">
                    <div className="text-[13px] font-bold text-[#1A2E1A]">{user.name}</div>
                    <div className="text-[11px] text-[#6B7B6B]">{user.roles[0]}</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  {user.roles.some(r => ['SELLER', 'PROFESSIONAL', 'ADMIN'].includes(r)) && (
                    <Link href="/vendeur">
                      <Button variant="secondary" size="sm" className="rounded-full h-9 px-4 gap-1.5 text-xs font-bold">
                        <LayoutDashboard className="h-4 w-4" /> Vendeur
                      </Button>
                    </Link>
                  )}
                  <Link href="/profil">
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-[#E8E0D0]/60">
                <Link href="/connexion">
                  <Button variant="ghost" size="sm" className="rounded-full h-9 px-4 text-[14px] font-medium">Connexion</Button>
                </Link>
                <Link href="/inscription">
                  <Button size="sm" className="rounded-full h-9 px-5 text-[14px] font-bold">S&apos;inscrire</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-10 w-10 ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - même identité */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E0D0]/60 bg-[#FFFEFB] absolute w-full left-0 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-4 space-y-1">
            <Link href="/" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Accueil <span>🏠</span></Link>
            <Link href="/services" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Services <span>🔧</span></Link>
            <Link href="/boutiques" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Boutiques <span>🛍️</span></Link>
            <Link href="/prix" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Prix <span>💰</span></Link>
            <Link href="/immobilier" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Immobilier <span>🏠</span></Link>
            <Link href="/emploi" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Emploi <span>💼</span></Link>
            <Link href="/campus" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Campus <span>🎓</span></Link>
            <Link href="/annonces" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white font-medium">Annonces <span>📢</span></Link>
            <div className="pt-4 mt-2 border-t border-[#E8E0D0] space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-[#6B7B6B]">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/profil"><Button variant="outline" className="w-full rounded-full h-11">Mon profil</Button></Link>
                  <Link href="/vendeur"><Button variant="secondary" className="w-full rounded-full h-11">Espace vendeur</Button></Link>
                  <Button variant="ghost" className="w-full rounded-full h-11" onClick={handleLogout}>Déconnexion</Button>
                </>
              ) : (
                <>
                  <Link href="/connexion"><Button variant="outline" className="w-full rounded-full h-11">Connexion</Button></Link>
                  <Link href="/inscription"><Button className="w-full rounded-full h-11">Créer un compte</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
