"use client"

import { motion } from "framer-motion"
import { MapPin, ShieldCheck, Zap, Users } from "lucide-react"

const valeurs = [
  { id: 'local', title: 'Local', description: "Soutient l'économie locale", icon: MapPin, color: '#0E9F6E' },
  { id: 'fiable', title: 'Fiable', description: 'Professionnels vérifiés', icon: ShieldCheck, color: '#FFB800' },
  { id: 'rapide', title: 'Rapide', description: 'Accès facile et rapide', icon: Zap, color: '#06B6D4' },
  { id: 'pour_tous', title: 'Pour tous', description: 'Particuliers et entreprises.', icon: Users, color: '#7C3AED' },
]

export function ValeursSection() {
  return (
    <section className="py-8 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {valeurs.map((valeur, index) => (
            <motion.div
              key={valeur.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-[#FFFBEB] border border-[#E8E0D0]/50 rounded-[16px] p-4 flex gap-3 items-start hover:shadow-sm transition-shadow"
            >
              <div className="h-9 w-9 rounded-full bg-white border border-[#E8E0D0]/60 flex items-center justify-center shrink-0 shadow-sm">
                <valeur.icon className="h-4 w-4" style={{ color: valeur.color }} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#1A2E1A] uppercase tracking-wide">{valeur.title}</div>
                <div className="text-[11px] text-[#6B7B6B] mt-0.5 leading-tight">{valeur.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
