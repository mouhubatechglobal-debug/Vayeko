import { jobs } from "@/lib/data"
import Link from "next/link"
import { MapPin, Clock, Briefcase, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"

export default function EmploiPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-white border-b border-[#E8E0D0]/60">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[28px] font-bold tracking-tight">Emploi au Togo</h1>
          <p className="text-sm text-[#6B7B6B] mt-1">Offres d&apos;emploi vérifiées • CDI, CDD, Stage, Freelance</p>
          <div className="mt-4 flex gap-2 max-w-[600px]">
            <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA99C]" /><Input placeholder="Développeur, commercial, comptable..." className="pl-11 rounded-full bg-[#FFFBEB]" /></div>
            <select className="h-11 rounded-full border border-[#E8E0D0] px-4 text-sm bg-white"><option>Toutes villes</option><option>Lomé</option><option>Kara</option></select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {jobs.map(job => (
              <Link key={job.id} href={`/emploi/${job.id}`} className="block bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group">
                <div className="flex gap-4">
                  <img src={job.companyLogo} alt={job.company} className="h-12 w-12 rounded-[12px] object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[16px] group-hover:text-[#E11D48] transition-colors">{job.title}</h3>
                        <div className="text-sm text-[#6B7B6B] mt-0.5 flex items-center gap-2"><Briefcase className="h-3.5 w-3.5" /> {job.company} • <MapPin className="h-3.5 w-3.5" /> {job.city} • {job.contractType}</div>
                      </div>
                      <Badge variant="secondary" className="bg-[#FFE4E6] text-[#9F1239] shrink-0">{job.contractType}</Badge>
                    </div>
                    <p className="text-xs text-[#6B7B6B] mt-3 line-clamp-2 leading-relaxed">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.competences.map(c => <span key={c} className="text-[11px] bg-[#F5F1E8] px-2.5 py-1 rounded-full">{c}</span>)}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#E11D48]">{job.salary}</span>
                      <span className="text-[#6B7B6B] flex items-center gap-1"><Clock className="h-3 w-3" /> Publié {formatRelativeTime(job.publicationDate)} • Expire {formatRelativeTime(job.deadline)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5">
              <h3 className="font-semibold">Filtres</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div><div className="font-medium text-xs mb-2">Type de contrat</div><div className="space-y-1.5"><label className="flex items-center gap-2"><input type="checkbox" /> CDI</label><label className="flex items-center gap-2"><input type="checkbox" /> CDD</label><label className="flex items-center gap-2"><input type="checkbox" /> Stage</label><label className="flex items-center gap-2"><input type="checkbox" /> Freelance</label></div></div>
                <div><div className="font-medium text-xs mb-2">Ville</div><div className="space-y-1.5"><label className="flex items-center gap-2"><input type="checkbox" /> Lomé</label><label className="flex items-center gap-2"><input type="checkbox" /> Kara</label><label className="flex items-center gap-2"><input type="checkbox" /> Sokodé</label></div></div>
              </div>
            </div>
            <div className="bg-[#1A2E1A] text-white rounded-[20px] p-5">
              <h4 className="font-semibold">Vous recrutez ?</h4>
              <p className="text-xs text-[#A8C5A8] mt-2 leading-relaxed">Publiez votre offre sur Vayeko et touchez des milliers de candidats au Togo.</p>
              <button className="mt-4 w-full h-10 rounded-full bg-white text-[#1A2E1A] text-sm font-medium">Publier une offre</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
