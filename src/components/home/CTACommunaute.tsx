"use client"

import Link from "next/link"

export function CTACommunaute() {
  return (
    <section className="py-6 sm:py-8 bg-[#FFF8E6]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[20px] overflow-hidden bg-[#0E3A23] flex flex-col lg:flex-row">
          {/* Left content */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 lg:w-[55%]">
            <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold leading-[1.15] text-white tracking-tight">
              Ensemble pour un Togo<br/>digital et plus fort !
            </h2>
            <p className="mt-3 text-[12px] sm:text-[13px] leading-[1.5] text-white/70 max-w-[320px]">
              Rejoignez la communauté Vayeko et profitez des meilleures opportunités près de chez vous.
            </p>
            <Link href="/inscription" className="inline-flex mt-5 h-9 px-5 rounded-full bg-[#FFB800] hover:bg-[#E6A600] text-[#0A2A12] font-bold text-[12px] items-center gap-1.5 transition-colors">
              Commencer maintenant <span>→</span>
            </Link>
          </div>

          {/* Right image - Lomé coastline + Togo map */}
          <div className="relative lg:w-[45%] h-[200px] lg:h-auto min-h-[200px] overflow-hidden">
            <img
              src="/images/lome-coast.jpg"
              alt="Lomé Togo ville côtière"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E3A23] via-[#0E3A23]/40 to-transparent lg:from-[#0E3A23] lg:via-[#0E3A23]/20" />
            
            {/* Togo map with flag colors overlay comme maquette */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[80px] h-[140px] sm:w-[90px] sm:h-[160px] z-10">
              <div className="w-full h-full relative drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                {/* Togo shape with flag stripes */}
                <div className="absolute inset-0 flex flex-col rounded-[4px] overflow-hidden border-2 border-white/30">
                  <div className="flex-1 bg-[#0E6F4C] relative flex items-center justify-center">
                    <span className="text-white text-[16px]">★</span>
                  </div>
                  <div className="flex-1 bg-[#FFB800]" />
                  <div className="flex-1 bg-[#E11D48]" />
                  <div className="flex-1 bg-[#0E6F4C]" />
                  <div className="flex-1 bg-[#FFB800]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
