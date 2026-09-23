"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { campusPosts } from "@/lib/data"
import { GraduationCap, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatRelativeTime } from "@/lib/utils"

export function CampusSection() {
  const allPosts = [
    ...campusPosts,
    { id: 'campus-4', title: 'Colocation 2 chambres - Adidogomé', description: 'Appartement 2 chambres proche campus UL, eau, élec, WiFi inclus, calme.', type: 'Logement étudiant', city: 'Lomé' as const, price: 20000, author: 'Vayeko Campus', phone: '', createdAt: new Date() },
    { id: 'campus-5', title: 'Hackathon Togo Tech 2026', description: '48h de code, prix à gagner, mentors internationaux, à l\'Université de Lomé.', type: 'Événement', city: 'Lomé' as const, price: null, author: 'Togo Tech', phone: '', createdAt: new Date() },
  ]

  return (
    <section className="py-10 sm:py-12 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A] flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-[#7C3AED]" /> Campus
            </h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Logements étudiants, stages, formations, événements • Jeune & dynamique</p>
          </div>
          <Link href="/campus" className="hidden sm:flex text-sm font-semibold text-[#7C3AED] hover:underline">Voir tout →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <Link href="/campus" className="block bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] border border-[#DDD6FE] rounded-[18px] p-5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)] hover:border-[#C4B5FD] transition-all group h-full">
                <div className="flex items-start justify-between gap-2">
                  <Badge className="bg-white text-[#6D28D9] border-[#DDD6FE] text-[11px] font-bold shadow-sm">{post.type}</Badge>
                  <span className="text-[11px] text-[#6B7B6B] flex items-center gap-1 font-medium"><MapPin className="h-3 w-3" /> {post.city}</span>
                </div>
                <h3 className="font-bold text-[14px] mt-3 leading-tight group-hover:text-[#6D28D9] transition-colors">{post.title}</h3>
                <p className="text-[12px] text-[#6B7B6B] mt-2 leading-relaxed line-clamp-3">{post.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#6B7B6B]">{post.author} • {formatRelativeTime(post.createdAt)}</span>
                  {post.price && <span className="font-extrabold text-[13px] text-[#7C3AED]">{formatPrice(post.price)}/mois</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
