"use client"

import { MapPin } from "lucide-react"
import { TOGO_CITIES } from "@/lib/utils"

interface LocationSelectorProps {
  value: string
  onChange: (city: string) => void
  className?: string
}

export function LocationSelector({ value, onChange, className = "" }: LocationSelectorProps) {
  return (
    <div className={`flex items-center gap-2 bg-[#FFFBEB] border border-[#E8E0D0] rounded-full px-4 h-11 ${className}`}>
      <MapPin className="h-4 w-4 text-[#0E9F6E]" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-[#1A2E1A] focus:outline-none cursor-pointer"
      >
        <option>Toutes</option>
        {TOGO_CITIES.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  )
}
