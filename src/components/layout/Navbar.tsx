"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, MapPin, Heart, ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getStoredUser, clearStoredUser, type UserSession } from "@/lib/auth"
import { TOGO_CITIES } from "@/lib/utils"

export function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState("Lomé")
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}&ville=${selectedCity}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E0D0]/50 bg-white/90 backdrop-blur-xl">
      {/* Top bar - Localisation */}
      <div className="bg-[#FFFBEB] border-b border-[#E8E0D0]/50">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-[#6B7B6B]">
              <MapPin className="h-3.5 w-3.5" />
              Livraison & services dans tout le Togo
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[#6B7B6B] hidden sm:inline">Ville :</span>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-medium text-[#1A2E1A] focus:outline-none cursor-pointer"
              >
                {TOGO_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#6B7B6B]">
            <span className="hidden md:inline">Besoin d&apos;aide ? +228 90 00 00 00</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-medium text-[#0E9F6E]">FCFA</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0E9F6E] to-[#065F46] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              V
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[19px] leading-none tracking-tight text-[#1A2E1A]">Vayeko</div>
              <div className="text-[10px] leading-none text-[#0E9F6E] font-medium tracking-wide mt-0.5">LE TOGO À PORTÉE DE MAIN</div>
            </div>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-[560px] mx-6 relative">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-[#9CA99C]" />
              <Input
                placeholder="Rechercher un produit, service, logement, emploi..."
                className="pl-11 pr-[100px] h-[44px] bg-[#FFFBEB] border-[#E8E0D0] focus:bg-white rounded-full text-[14px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="sm" className="absolute right-1.5 h-[36px] px-5 rounded-full">
                Rechercher
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link href="/favoris" className="relative p-2.5 rounded-full hover:bg-[#FFFBEB] transition-colors">
              <Heart className="h-5 w-5 text-[#1A2E1A]" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#E11D48]">2</Badge>
            </Link>
            <Link href="/commandes" className="relative p-2.5 rounded-full hover:bg-[#FFFBEB] transition-colors hidden sm:flex">
              <ShoppingBag className="h-5 w-5 text-[#1A2E1A]" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">1</Badge>
            </Link>
            <Link href="/notifications" className="relative p-2.5 rounded-full hover:bg-[#FFFBEB] transition-colors hidden sm:flex">
              <Bell className="h-5 w-5 text-[#1A2E1A]" />
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <div className="hidden sm:flex items-center gap-2.5 pl-2">
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  <div className="hidden md:block text-left leading-tight">
                    <div className="text-sm font-semibold text-[#1A2E1A]">{user.name}</div>
                    <div className="text-[11px] text-[#6B7B6B]">{user.roles[0]}</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-1 ml-2">
                  {user.roles.includes('SELLER') || user.roles.includes('PROFESSIONAL') || user.roles.includes('ADMIN') ? (
                    <Link href="/vendeur">
                      <Button variant="secondary" size="sm" className="rounded-full gap-1.5">
                        <LayoutDashboard className="h-4 w-4" />
                        Vendeur
                      </Button>
                    </Link>
                  ) : null}
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
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link href="/connexion">
                  <Button variant="ghost" size="sm" className="rounded-full">Connexion</Button>
                </Link>
                <Link href="/inscription">
                  <Button size="sm" className="rounded-full">S&apos;inscrire</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search mobile */}
        <form onSubmit={handleSearch} className="lg:hidden pb-3">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-[#9CA99C]" />
            <Input
              placeholder="Rechercher..."
              className="pl-11 pr-20 h-11 bg-[#FFFBEB] rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="sm" className="absolute right-1 h-9 px-4 rounded-full">Go</Button>
          </div>
        </form>
      </div>

      {/* Secondary nav - Categories */}
      <div className="hidden md:block border-t border-[#E8E0D0]/50 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-none">
            <Link href="/services" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Services</Link>
            <Link href="/boutiques" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Boutiques</Link>
            <Link href="/prix" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors flex items-center gap-1.5">
              Prix
              <span className="bg-[#FFB800] text-[#1A2E1A] text-[10px] px-1.5 py-0.5 rounded-full font-bold">Nouveau</span>
            </Link>
            <Link href="/immobilier" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Immobilier</Link>
            <Link href="/emploi" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Emploi</Link>
            <Link href="/campus" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Campus</Link>
            <Link href="/annonces" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-[#1A2E1A] hover:text-[#0E9F6E] hover:bg-[#FFFBEB] rounded-full transition-colors">Annonces</Link>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/devenir-vendeur" className="whitespace-nowrap text-sm font-semibold text-[#0E9F6E] hover:underline">Devenir vendeur →</Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E0D0] bg-white absolute w-full left-0 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            <Link href="/services" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#FFFBEB]">Services <span>🔧</span></Link>
            <Link href="/boutiques" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#FFFBEB]">Boutiques <span>🛍️</span></Link>
            <Link href="/immobilier" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#FFFBEB]">Immobilier <span>🏠</span></Link>
            <Link href="/emploi" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#FFFBEB]">Emploi <span>💼</span></Link>
            <Link href="/campus" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#FFFBEB]">Campus <span>🎓</span></Link>
            <Link href="/annonces" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#FFFBEB]">Annonces <span>📢</span></Link>
            <div className="pt-4 mt-2 border-t border-[#E8E0D0] space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-[#6B7B6B]">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/profil"><Button variant="outline" className="w-full rounded-full">Mon profil</Button></Link>
                  <Link href="/vendeur"><Button variant="secondary" className="w-full rounded-full">Espace vendeur</Button></Link>
                  <Button variant="ghost" className="w-full rounded-full" onClick={handleLogout}>Déconnexion</Button>
                </>
              ) : (
                <>
                  <Link href="/connexion"><Button variant="outline" className="w-full rounded-full">Connexion</Button></Link>
                  <Link href="/inscription"><Button className="w-full rounded-full">Créer un compte</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
