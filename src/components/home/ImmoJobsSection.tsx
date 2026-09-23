import Link from "next/link"
import { properties, jobs, listings, campusPosts } from "@/lib/data"
import { formatPrice, formatRelativeTime } from "@/lib/utils"
import { MapPin, Bed, Square, Building2, Briefcase, GraduationCap, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ImmoJobsSection() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Immobilier */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold flex items-center gap-2"><Building2 className="h-5 w-5 text-[#06B6D4]" /> Immobilier</h2>
              <Link href="/immobilier" className="text-sm text-[#06B6D4] font-medium hover:underline">Voir tout →</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {properties.slice(0, 2).map((prop) => (
                <Link key={prop.id} href={`/immobilier/${prop.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[18px] overflow-hidden hover:shadow-md transition-all">
                  <div className="relative h-[160px] overflow-hidden">
                    <img src={prop.photos[0]} alt={prop.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <Badge className="bg-[#06B6D4] text-white text-[11px]">{prop.type}</Badge>
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur text-[11px]">{prop.status}</Badge>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-semibold text-[14px] leading-tight line-clamp-1">{prop.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#6B7B6B]">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {prop.city} • {prop.quartier}</span>
                      {prop.pieces > 0 && <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {prop.pieces} pièces</span>}
                      <span className="flex items-center gap-1"><Square className="h-3 w-3" /> {prop.superficie}m²</span>
                    </div>
                    <div className="mt-2 font-bold text-[#06B6D4]">{formatPrice(prop.price)} <span className="text-xs font-normal text-[#6B7B6B]">{prop.priceType}</span></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Annonces */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold flex items-center gap-2"><Tag className="h-5 w-5 text-[#F59E0B]" /> Annonces récentes</h2>
                <Link href="/annonces" className="text-sm text-[#F59E0B] font-medium hover:underline">Voir tout →</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {listings.map((ann) => (
                  <Link key={ann.id} href={`/annonces/${ann.id}`} className="group bg-white border border-[#E8E0D0]/60 rounded-[16px] p-3 flex gap-3 hover:shadow-sm transition-all">
                    <img src={ann.images[0]} alt={ann.title} className="h-16 w-16 rounded-[10px] object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[13px] leading-tight line-clamp-1">{ann.title}</div>
                      <div className="text-[11px] text-[#6B7B6B] mt-0.5">{ann.city} • {formatRelativeTime(ann.createdAt)}</div>
                      <div className="font-bold text-[13px] mt-1 text-[#1A2E1A]">{formatPrice(ann.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs & Campus */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold flex items-center gap-2"><Briefcase className="h-5 w-5 text-[#E11D48]" /> Emploi</h2>
                <Link href="/emploi" className="text-sm text-[#E11D48] font-medium hover:underline">Voir tout →</Link>
              </div>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/emploi/${job.id}`} className="block bg-white border border-[#E8E0D0]/60 rounded-[16px] p-4 hover:shadow-sm transition-all group">
                    <div className="flex gap-3">
                      <img src={job.companyLogo} alt={job.company} className="h-10 w-10 rounded-[10px] object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] leading-tight group-hover:text-[#E11D48] transition-colors">{job.title}</div>
                        <div className="text-xs text-[#6B7B6B]">{job.company} • {job.city}</div>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-[10px]">{job.contractType}</Badge>
                          <span className="text-[11px] text-[#6B7B6B]">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold flex items-center gap-2"><GraduationCap className="h-5 w-5 text-[#7C3AED]" /> Campus</h2>
                <Link href="/campus" className="text-sm text-[#7C3AED] font-medium hover:underline">Voir tout →</Link>
              </div>
              <div className="space-y-2.5">
                {campusPosts.map((post) => (
                  <Link key={post.id} href="/campus" className="block bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] border border-[#DDD6FE] rounded-[14px] p-3 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-[13px] leading-tight">{post.title}</div>
                      <Badge variant="secondary" className="bg-white text-[10px] shrink-0">{post.type}</Badge>
                    </div>
                    <div className="text-[11px] text-[#6B7B6B] mt-1 line-clamp-2">{post.description}</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-[#6B7B6B]">{post.city} • {formatRelativeTime(post.createdAt)}</span>
                      {post.price && <span className="font-bold text-[#7C3AED]">{formatPrice(post.price)}/mois</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
