"use client"

import { useState, useMemo } from "react"
import { professionCategories, professions, customProfession, VerificationStatus } from "@/lib/professions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Check, Plus } from "lucide-react"

interface ProfessionSelectorProps {
  selectedProfessionId?: string
  customProfession?: string
  onSelect: (professionId: string | null, customProfession?: string) => void
  showVerificationInfo?: boolean
}

export function ProfessionSelector({ selectedProfessionId, customProfession: initialCustom, onSelect, showVerificationInfo = true }: ProfessionSelectorProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [customValue, setCustomValue] = useState(initialCustom || "")
  const [showCustomInput, setShowCustomInput] = useState(selectedProfessionId === 'autre')

  const filteredProfessions = useMemo(() => {
    let filtered = professions.filter(p => p.isActive)
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.categoryId === selectedCategory)
    }
    
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.includes(q)
      )
    }
    
    return filtered
  }, [search, selectedCategory])

  const handleSelect = (professionId: string) => {
    if (professionId === 'autre') {
      setShowCustomInput(true)
      onSelect('autre', customValue)
    } else {
      setShowCustomInput(false)
      onSelect(professionId)
    }
  }

  const handleCustomSubmit = () => {
    if (customValue.trim().length >= 2) {
      onSelect('autre', customValue.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#FFFBEB] border border-[#E8E0D0] rounded-[12px] p-3 text-xs leading-relaxed">
        <div className="font-bold text-[#1A2E1A]">Profession ≠ Rôle</div>
        <div className="text-[#6B7B6B] mt-1">
          <span className="font-medium">Rôle</span> = ce que vous POUVEZ faire sur Vayeko (USER, SELLER, PROFESSIONAL...)<br/>
          <span className="font-medium">Profession</span> = ce que vous FAITES dans la vie (mécanicien, coiffeur, architecte...)<br/>
          Ex: mécanicien = USER + PROFESSIONAL, boutique = USER + SELLER, peut cumuler USER+SELLER+PROFESSIONAL
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA99C]" />
        <Input
          placeholder="Rechercher une profession..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-full h-11 bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${selectedCategory === "all" ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]' : 'bg-white border-[#E8E0D0] hover:border-[#0E9F6E]'}`}
        >
          Toutes
        </button>
        {professionCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${selectedCategory === cat.id ? 'bg-[#1A2E1A] text-white border-[#1A2E1A]' : 'bg-white border-[#E8E0D0] hover:border-[#1A2E1A]'}`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
        {filteredProfessions.map(prof => {
          const isSelected = selectedProfessionId === prof.id
          const category = professionCategories.find(c => c.id === prof.categoryId)
          return (
            <button
              key={prof.id}
              onClick={() => handleSelect(prof.id)}
              className={`text-left p-3 rounded-[12px] border transition-all ${isSelected ? 'bg-[#0E9F6E] text-white border-[#0E9F6E] shadow-sm' : 'bg-white border-[#E8E0D0] hover:border-[#0E9F6E] hover:bg-[#FFFBEB]'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-2">
                  <span className="text-[18px]">{prof.icon}</span>
                  <div>
                    <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-[#1A2E1A]'}`}>{prof.name}</div>
                    <div className={`text-[11px] mt-0.5 leading-tight ${isSelected ? 'text-white/80' : 'text-[#6B7B6B]'}`}>{prof.description}</div>
                    <div className="flex gap-1 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F5F1E8] text-[#6B7B6B]'}`}>{category?.name}</span>
                      {prof.requiresVerification && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-[#FFB800] text-[#1A2E1A]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>Vérif. requise</span>}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => handleSelect('autre')}
        className={`w-full p-3 rounded-[12px] border-2 border-dashed flex items-center gap-2 text-xs font-medium ${selectedProfessionId === 'autre' ? 'bg-[#1A2E1A] text-white border-[#1A2E1A]' : 'bg-white border-[#E8E0D0] hover:border-[#0E9F6E] text-[#6B7B6B] hover:text-[#0E9F6E]'}`}
      >
        <Plus className="h-4 w-4" /> {customProfession.name} — Saisie libre
      </button>

      {showCustomInput && (
        <div className="bg-white border border-[#E8E0D0] rounded-[12px] p-3 space-y-3">
          <div>
            <label className="text-xs font-bold">Votre profession (saisie libre)</label>
            <Input
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Ex: Réparateur de téléphones, Éleveur de poulets..."
              className="mt-1 rounded-full h-11"
            />
            <div className="text-[11px] text-[#6B7B6B] mt-1">Cette profession sera enregistrée et pourra être ajoutée au catalogue officiel après modération.</div>
          </div>
          <Button size="sm" className="rounded-full" onClick={handleCustomSubmit} disabled={customValue.trim().length < 2}>Valider profession personnalisée</Button>
        </div>
      )}

      {showVerificationInfo && (
        <div className="bg-[#1A2E1A] text-white rounded-[12px] p-3 text-xs">
          <div className="font-bold">Vérification</div>
          <div className="mt-2 space-y-1.5 text-white/70 leading-relaxed">
            <div className="flex gap-2"><Badge className="bg-[#F5F1E8] text-[#6B7B6B] text-[10px] h-fit">NON_VÉRIFIÉ</Badge> <span>Par défaut — peut publier mais badge gris</span></div>
            <div className="flex gap-2"><Badge className="bg-[#FEF3C7] text-[#92400E] text-[10px] h-fit">EN_VÉRIFICATION</Badge> <span>Demande envoyée à admin</span></div>
            <div className="flex gap-2"><Badge className="bg-[#D1FAE5] text-[#065F46] text-[10px] h-fit">VÉRIFIÉ</Badge> <span>Vérifié par admin — badge vert, confiance +</span></div>
            <div className="flex gap-2"><Badge className="bg-[#FFE4E6] text-[#9F1239] text-[10px] h-fit">REJETÉ</Badge> <span>Rejeté — raison fournie</span></div>
            <div className="mt-2 text-[11px]">⚠️ Santé/Juridique : vérification obligatoire. Vayeko ne prétend pas qu'une personne est pro santé vérifié si statut non vérifié. Vérification jamais auto — admin gère.</div>
          </div>
        </div>
      )}
    </div>
  )
}
