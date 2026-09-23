"use client"

import { MapPin, ShieldCheck, Zap, Users } from "lucide-react"

const valeurs = [
  { icon: MapPin, title: 'Local', desc: 'Soutient l\'économie locale', color: '#FFB800' },
  { icon: ShieldCheck, title: 'Fiable', desc: 'Professionnels vérifiés', color: '#FFB800' },
  { icon: Zap, title: 'Rapide', desc: 'Accès facile et rapide', color: '#FFB800' },
  { icon: Users, title: 'Pour tous', desc: 'Particuliers et entreprises.', color: '#FFB800' },
]

export function ValeursSection() {
  return (
    <section className="py-4 sm:py-6 bg-[#FFF8E6]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {valeurs.map((v) => (
            <div key={v.title} className="bg-[#FFF5D6]/80 border border-[#E8DCC0]/50 rounded-[12px] p-3 sm:p-4 flex flex-col items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-[#FFB800]/20 flex items-center justify-center">
                <v.icon className="h-3.5 w-3.5 text-[#B77900]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-extrabold text-[12px] text-[#0A2A12] tracking-wide">{v.title}</div>
                <div className="text-[10px] leading-[1.3] text-[#6B7B6B] mt-0.5">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
