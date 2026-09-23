"use client"

import Link from "next/link"

export function CTACommunaute() {
  return (
    <section className="py-6 sm:py-8 bg-[#FFF8E6]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[20px] overflow-hidden bg-[#0E3A23] flex flex-col lg:flex-row">
          {/* Contenu gauche */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-8 lg:w-[55%]">
            <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold leading-[1.15] text-white">
              Ensemble pour un Togo<br/>
              digital et plus fort !
            </h2>
            <p className="mt-3 text-[11px] sm:text-[12px] leading-[1.5] text-white/70 max-w-[300px]">
              Rejoignez la communauté Vayeko et profitez des meilleures opportunités près de chez vous.
            </p>
            <Link href="/inscription" className="inline-block mt-5">
              <span className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#E6A600] text-[#0A2A12] font-bold text-[12px] px-4 py-2.5 rounded-full transition-colors">
                Commencer maintenant <span>→</span>
              </span>
            </Link>
          </div>

          {/* Droite - image côte + carte Togo comme maquette */}
          <div className="relative lg:w-[45%] h-[180px] lg:h-auto min-h-[180px] overflow-hidden">
            {/* Image côte Lomé */}
            <img
              src="/images/lome-coast.jpg"
              alt="Côte de Lomé Togo"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E3A23] via-[#0E3A23]/20 to-transparent lg:from-[#0E3A23] lg:via-[#0E3A23]/60" />
            
            {/* Carte Togo avec drapeau comme maquette */}
            <div className="absolute right-1/2 lg:right-8 top-1/2 -translate-y-1/2 translate-x-1/2 lg:translate-x-0">
              <div className="relative w-[60px] h-[90px] sm:w-[70px] sm:h-[110px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                {/* Forme Togo stylisée avec couleurs drapeau */}
                <div className="absolute inset-0">
                  {/* Vert */}
                  <div className="h-[22%] bg-[#0E6F4C] rounded-t-[6px]" />
                  {/* Jaune avec étoile */}
                  <div className="h-[22%] bg-[#FFB800] flex items-center justify-center relative">
                    <span className="text-white text-[14px] font-bold drop-shadow">★</span>
                  </div>
                  {/* Vert */}
                  <div className="h-[18%] bg-[#0E6F4C]" />
                  {/* Jaune */}
                  <div className="h-[18%] bg-[#FFB800]" />
                  {/* Rouge */}
                  <div className="h-[20%] bg-[#E11D48] rounded-b-[6px]" />
                </div>
                {/* Bordure blanche */}
                <div className="absolute inset-0 border-2 border-white rounded-[6px] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
