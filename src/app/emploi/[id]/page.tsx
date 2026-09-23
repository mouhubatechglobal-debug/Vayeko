"use client"

import { useParams } from "next/navigation"
import { jobs } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, Clock, Building2 } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

export default function JobDetail() {
  const params = useParams()
  const id = params.id as string
  const job = jobs.find(j => j.id === id) || jobs[0]

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-6 sm:p-8">
          <div className="flex gap-4">
            <img src={job.companyLogo} alt={job.company} className="h-16 w-16 rounded-[16px] object-cover" />
            <div className="flex-1">
              <h1 className="text-[24px] font-bold leading-tight">{job.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#6B7B6B]">
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.company}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.city}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.contractType}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Publié {formatRelativeTime(job.publicationDate)}</span>
              </div>
              <div className="mt-3 flex gap-2"><Badge className="bg-[#E11D48]">{job.contractType}</Badge><Badge variant="secondary">{job.salary}</Badge></div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div><h3 className="font-semibold">Description du poste</h3><p className="mt-2 text-sm text-[#6B7B6B] leading-relaxed">{job.description} Nous cherchons une personne motivée, rigoureuse et passionnée. Vous rejoindrez une équipe dynamique au cœur de {job.city}.</p></div>
            <div><h3 className="font-semibold">Compétences demandées</h3><div className="mt-2 flex flex-wrap gap-2">{job.competences.map(c => <span key={c} className="text-xs bg-[#FFE4E6] text-[#9F1239] px-3 py-1.5 rounded-full font-medium">{c}</span>)}</div></div>
            <div><h3 className="font-semibold">Détails</h3><div className="mt-2 grid sm:grid-cols-2 gap-3 text-sm"><div className="bg-[#FFFBEB] rounded-[12px] p-3"><div className="text-xs text-[#6B7B6B]">Type de contrat</div><div className="font-medium">{job.contractType}</div></div><div className="bg-[#FFFBEB] rounded-[12px] p-3"><div className="text-xs text-[#6B7B6B]">Salaire</div><div className="font-medium">{job.salary}</div></div><div className="bg-[#FFFBEB] rounded-[12px] p-3"><div className="text-xs text-[#6B7B6B]">Ville</div><div className="font-medium">{job.city}</div></div><div className="bg-[#FFFBEB] rounded-[12px] p-3"><div className="text-xs text-[#6B7B6B]">Date limite</div><div className="font-medium">{formatRelativeTime(job.deadline)}</div></div></div></div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button className="flex-1 rounded-full h-12 bg-[#E11D48] hover:bg-[#BE123C]">Postuler maintenant</Button>
            <Button variant="outline" className="rounded-full h-12 px-6">Sauvegarder</Button>
          </div>
          <div className="mt-3 text-[11px] text-[#6B7B6B] text-center">Candidature via Vayeko • Votre CV sera transmis au recruteur • Vous serez notifié</div>
        </div>
      </div>
    </div>
  )
}
