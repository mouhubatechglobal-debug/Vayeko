"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  initialQuery?: string
  initialCity?: string
  placeholder?: string
  className?: string
}

export function SearchBar({ initialQuery = "", initialCity = "Lomé", placeholder = "Rechercher un produit, service, logement, emploi...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query)}&ville=${encodeURIComponent(city)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-[20px] sm:rounded-full border border-[#E8E0D0] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-[#9CA99C]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-11 border-0 bg-transparent h-12 text-[15px] focus-visible:ring-0 focus-visible:border-0 shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-[#FFFBEB] rounded-full px-3 h-12 border border-[#E8E0D0]/50">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-sm font-medium text-[#1A2E1A] focus:outline-none pr-6 cursor-pointer"
            >
              <option>Lomé</option>
              <option>Sokodé</option>
              <option>Kara</option>
              <option>Atakpamé</option>
              <option>Kpalimé</option>
              <option>Dapaong</option>
              <option>Toutes</option>
            </select>
          </div>
          <Button type="submit" size="lg" className="h-12 px-7 rounded-full shrink-0">
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  )
}
