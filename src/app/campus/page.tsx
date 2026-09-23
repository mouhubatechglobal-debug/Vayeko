import { campusPosts } from "@/lib/data"
import { GraduationCap, MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatRelativeTime } from "@/lib/utils"

export default function CampusPage() {
  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"><GraduationCap className="h-6 w-6" /></div><Badge className="bg-white text-[#7C3AED]">Campus Vayeko</Badge></div>
          <h1 className="text-[32px] font-bold tracking-tight leading-tight">Opportunités pour étudiants</h1>
          <p className="text-white/80 mt-2 max-w-[600px]">Logements étudiants, stages, formations, événements et services utiles. Pensé pour les étudiants togolais.</p>
          <div className="mt-6 max-w-[500px] relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" /><Input placeholder="Rechercher logement, stage, formation..." className="pl-11 rounded-full bg-white/15 border-white/20 text-white placeholder:text-white/60 h-12" /></div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
          {['Tous', 'Logement étudiant', 'Stage', 'Formation', 'Événement', 'Opportunité'].map(cat => (
            <button key={cat} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border ${cat === 'Tous' ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-white border-[#E8E0D0] hover:border-[#7C3AED]'}`}>{cat}</button>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campusPosts.map(post => (
            <div key={post.id} className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2"><Badge className="bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]">{post.type}</Badge><span className="text-xs text-[#6B7B6B] flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.city}</span></div>
              <h3 className="font-bold text-[15px] mt-3 leading-tight">{post.title}</h3>
              <p className="text-xs text-[#6B7B6B] mt-2 leading-relaxed line-clamp-3">{post.description}</p>
              <div className="mt-4 flex items-center justify-between"><span className="text-xs text-[#6B7B6B]">{post.author} • {formatRelativeTime(post.createdAt)}</span>{post.price && <span className="font-bold text-[#7C3AED]">{formatPrice(post.price)}/mois</span>}</div>
              <button className="mt-4 w-full h-9 rounded-full bg-[#7C3AED] text-white text-sm font-medium">Contacter</button>
            </div>
          ))}
          {/* Extra mock */}
          {[
            { title: 'Colocation 2 chambres - Adidogomé', type: 'Logement étudiant', city: 'Lomé', price: 20000, desc: 'Appartement 2 chambres proche campus, eau, élec, WiFi inclus.' },
            { title: 'Hackathon Togo Tech 2026', type: 'Événement', city: 'Lomé', price: null, desc: '48h de code, prix à gagner, mentors internationaux.' },
            { title: 'Bourse Master France', type: 'Opportunité', city: 'Lomé', price: null, desc: 'Bourse complète pour Master en informatique, candidature avant 30 oct.' },
          ].map((p, i) => (
            <div key={i} className="bg-white border border-[#E8E0D0]/60 rounded-[20px] p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2"><Badge className="bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]">{p.type}</Badge><span className="text-xs text-[#6B7B6B] flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.city}</span></div>
              <h3 className="font-bold text-[15px] mt-3 leading-tight">{p.title}</h3>
              <p className="text-xs text-[#6B7B6B] mt-2 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex items-center justify-between"><span className="text-xs text-[#6B7B6B]">Vayeko Campus</span>{p.price && <span className="font-bold text-[#7C3AED]">{formatPrice(p.price)}/mois</span>}</div>
              <button className="mt-4 w-full h-9 rounded-full bg-[#7C3AED] text-white text-sm font-medium">Voir détails</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
