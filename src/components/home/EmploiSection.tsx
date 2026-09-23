"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { jobs } from "@/lib/data"
import { MapPin, Briefcase, Clock, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"

export function EmploiSection() {
  return (
    <section className="py-10 sm:py-12 bg-[#FFFBEB]/30">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#1A2E1A] flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-[#E11D48]" /> Emploi
            </h2>
            <p className="text-[13px] sm:text-sm text-[#6B7B6B] mt-1">Offres vérifiées • CDI, CDD, Stage • Lomé, Kara, Sokodé</p>
          </div>
          <Link href="/emploi" className="hidden sm:flex text-sm font-semibold text-[#E11D48] hover:underline">Voir tout →</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Link href={`/emploi/${job.id}`} className="block bg-white border border-[#E8E0D0]/60 rounded-[18px] p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#E8E0D0] transition-all group h-full">
                <div className="flex gap-3">
                  <img src={job.companyLogo} alt={job.company} className="h-12 w-12 rounded-[12px] object-cover border border-[#E8E0D0]/50" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[14px] leading-tight group-hover:text-[#E11D48] transition-colors line-clamp-2">{job.title}</h3>
                    <div className="text-[12px] text-[#6B7B6B] mt-1 flex items-center gap-1.5"><Building2 className="h-3 w-3" /> {job.company} • <MapPin className="h-3 w-3" /> {job.city}</div>
                    <div className="flex gap-1.5 mt-2.5">
                      <Badge className="bg-[#FFE4E6] text-[#9F1239] text-[11px] font-bold border border-[#FFA2A2]/30">{job.contractType}</Badge>
                      <span className="text-[11px] text-[#6B7B6B] bg-[#F5F1E8] px-2 py-0.5 rounded-full font-medium">{job.salary}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {job.competences.slice(0, 3).map(c => <span key={c} className="text-[10px] bg-[#FFFBEB] border border-[#E8E0D0]/50 px-2 py-0.5 rounded-full">{c}</span>)}
                    </div>
                    <div className="mt-3 text-[11px] text-[#9CA99C] flex items-center gap-1"><Clock className="h-3 w-3" /> Publié {formatRelativeTime(job.publicationDate)}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
