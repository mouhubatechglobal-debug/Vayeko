import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0A2A12] text-white mt-0">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-[6px] bg-white flex items-center justify-center">
                <span className="text-[#0A2A12] font-black text-[14px]">V</span>
              </div>
              <span className="font-extrabold text-[16px]">Vayeko</span>
            </div>
            <p className="text-[11px] text-white/80">Le Togo à portée de main !</p>
            <div className="flex gap-2 mt-4">
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-[11px] font-bold">f</a>
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-[10px]">📷</a>
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-[11px] font-bold">𝕏</a>
              <a href="#" className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-[10px] font-bold">in</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[11px] tracking-wide text-white/90 mb-3 uppercase">Navigation</h4>
            <ul className="space-y-2 text-[11px] text-white/60">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/boutiques" className="hover:text-white">Boutiques</Link></li>
              <li><Link href="/prix" className="hover:text-white">Prix</Link></li>
              <li><Link href="/immobilier" className="hover:text-white">Immobilier</Link></li>
              <li><Link href="/emploi" className="hover:text-white">Emploi</Link></li>
              <li><Link href="/campus" className="hover:text-white">Campus</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[11px] tracking-wide text-white/90 mb-3 uppercase">À propos</h4>
            <ul className="space-y-2 text-[11px] text-white/60">
              <li><Link href="/a-propos" className="hover:text-white">Notre mission</Link></li>
              <li><Link href="/contact" className="hover:text-white">Nous contacter</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/conditions" className="hover:text-white">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[14px]">🇹🇬</span>
              <span className="font-bold text-[12px]">Togo</span>
              <span className="text-[10px] text-white/60 ml-1">▼</span>
            </div>
            <div className="text-[11px] text-white/60">
              Pays/territoires <span className="text-[8px]">▼</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-4 text-center">
          <div className="text-[10px] text-white/40">© 2025 Vayeko. Tous droits réservés.</div>
        </div>
      </div>

      <div className="h-[0.3cm] w-full overflow-hidden">
        <img src="/images/african-bandeau-03cm.png" alt="Motif africain bandeau 0,3cm" className="w-full h-full object-cover object-center" />
      </div>
    </footer>
  )
}
