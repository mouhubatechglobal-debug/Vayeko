import Link from "next/link"
import { categories } from "@/lib/data"

export function Categories() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold tracking-tight text-[#1A2E1A]">Explorer par catégorie</h2>
          <Link href="/recherche" className="text-sm font-medium text-[#0E9F6E] hover:underline hidden sm:block">Voir tout →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.id === 'prix' ? 'comparateur' : cat.id}`}
              className="group relative bg-white border border-[#E8E0D0]/70 rounded-[20px] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#E8E0D0] hover:-translate-y-0.5 transition-all"
            >
              <div className="h-11 w-11 rounded-[12px] flex items-center justify-center text-[22px] mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${cat.color}15` }}>
                {cat.icon}
              </div>
              <div className="font-semibold text-[14px] text-[#1A2E1A] leading-tight">{cat.name}</div>
              <div className="text-[12px] text-[#6B7B6B] mt-0.5">{cat.count.toLocaleString('fr-FR')} offres</div>
              <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#0E9F6E] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
