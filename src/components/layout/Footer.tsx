import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0E3A23] text-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo + slogan + réseaux comme maquette */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-[6px] bg-white flex items-center justify-center">
                <span className="text-[#0E6F4C] font-black text-[14px]">V</span>
              </div>
              <span className="font-extrabold text-[18px] tracking-tight">Vayeko</span>
            </div>
            <p className="text-[11px] text-white/70 font-medium">Le Togo à portée de main !</p>
            <div className="flex gap-2 mt-4">
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <span className="text-[11px] font-bold">f</span>
              </a>
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <span className="text-[10px]">📷</span>
              </a>
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <span className="text-[11px] font-bold">𝕏</span>
              </a>
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <span className="text-[10px] font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Navigation comme maquette */}
          <div>
            <h4 className="font-bold text-[11px] tracking-wide text-white/90 mb-3 uppercase">Navigation</h4>
            <ul className="space-y-2 text-[11px] text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/boutiques" className="hover:text-white transition-colors">Boutiques</Link></li>
              <li><Link href="/prix" className="hover:text-white transition-colors">Prix</Link></li>
              <li><Link href="/immobilier" className="hover:text-white transition-colors">Immobilier</Link></li>
              <li><Link href="/emploi" className="hover:text-white transition-colors">Emploi</Link></li>
              <li><Link href="/campus" className="hover:text-white transition-colors">Campus</Link></li>
            </ul>
          </div>

          {/* À propos comme maquette */}
          <div>
            <h4 className="font-bold text-[11px] tracking-wide text-white/90 mb-3 uppercase">À propos</h4>
            <ul className="space-y-2 text-[11px] text-white/60">
              <li><Link href="/a-propos" className="hover:text-white transition-colors">Notre mission</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/conditions" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Togo selector comme maquette */}
          <div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-bold bg-white/10 rounded-full px-3 py-1.5 w-fit">
                <span>🇹🇬</span> Togo <span className="text-[10px] ml-1">▼</span>
              </div>
              <div className="text-[11px] text-white/60 flex items-center gap-1">
                Pays/territoires <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-4 text-center">
          <p className="text-[10px] text-white/40">© 2025 Vayeko. Tous droits réservés.</p>
        </div>
      </div>

      {/* Motif final bandeau textile africain comme maquette - exactement */}
      <div className="h-[18px] w-full overflow-hidden relative">
        <img src="/images/african-pattern.jpg" alt="" className="w-full h-full object-cover" />
      </div>
    </footer>
  )
}
