import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0A2A12] text-white mt-0">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Première zone - Logo + slogan + réseaux */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0E9F6E] to-[#065F46]" />
                <div className="absolute top-0 right-0 h-3 w-3 bg-[#FFB800] rounded-bl-[8px]" />
                <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-lg">V</div>
              </div>
              <div className="font-extrabold text-[20px] leading-none tracking-tight">Vayeko</div>
            </div>
            <p className="text-sm text-[#A8C5A8] leading-relaxed font-medium">
              Le Togo à portée de main !
            </p>
            <p className="text-xs text-white/60 mt-2 leading-relaxed max-w-[260px]">
              Plateforme locale tout-en-un : services, boutiques, prix, logements, annonces, emploi.
            </p>
            <div className="flex gap-2.5 mt-6">
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#0E9F6E] flex items-center justify-center transition-colors text-xs font-bold">f</a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#0E9F6E] flex items-center justify-center transition-colors text-xs">📷</a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white hover:text-[#0A2A12] flex items-center justify-center transition-colors text-xs font-bold">𝕏</a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#0E9F6E] flex items-center justify-center transition-colors text-[11px] font-bold">in</a>
            </div>
          </div>

          {/* Deuxième colonne - NAVIGATION */}
          <div>
            <h4 className="font-extrabold mb-4 text-[12px] tracking-widest text-white/90 uppercase">Navigation</h4>
            <ul className="space-y-2.5 text-[14px] text-[#A8C5A8]">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/boutiques" className="hover:text-white transition-colors">Boutiques</Link></li>
              <li><Link href="/prix" className="hover:text-white transition-colors">Prix</Link></li>
              <li><Link href="/immobilier" className="hover:text-white transition-colors">Immobilier</Link></li>
              <li><Link href="/emploi" className="hover:text-white transition-colors">Emploi</Link></li>
              <li><Link href="/campus" className="hover:text-white transition-colors">Campus</Link></li>
            </ul>
          </div>

          {/* Troisième colonne - À PROPOS */}
          <div>
            <h4 className="font-extrabold mb-4 text-[12px] tracking-widest text-white/90 uppercase">À propos</h4>
            <ul className="space-y-2.5 text-[14px] text-[#A8C5A8]">
              <li><Link href="/a-propos" className="hover:text-white transition-colors">Notre mission</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/conditions" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Quatrième zone - Sélecteur pays */}
          <div>
            <h4 className="font-extrabold mb-4 text-[12px] tracking-widest text-white/90 uppercase">Pays</h4>
            <div className="space-y-3">
              <div className="bg-white/10 border border-white/10 rounded-full px-4 py-2.5 flex items-center gap-2 text-sm">
                <span className="text-[16px]">🇹🇬</span> <span className="font-bold">Togo</span>
              </div>
              <div className="text-xs text-white/60 leading-relaxed">
                Pays/territoires disponibles :<br/>
                <span className="text-[#A8C5A8]">Lomé, Sokodé, Kara, Atakpamé, Kpalimé, Dapaong</span>
              </div>
              <div className="pt-3">
                <div className="text-[11px] font-bold text-[#86EFAC] uppercase tracking-wide mb-2">Paiement FCFA</div>
                <div className="flex gap-2">
                  <div className="h-7 px-2.5 rounded-full bg-white/10 text-[11px] flex items-center font-medium">Flooz</div>
                  <div className="h-7 px-2.5 rounded-full bg-white/10 text-[11px] flex items-center font-medium">TMoney</div>
                  <div className="h-7 px-2.5 rounded-full bg-white/10 text-[11px] flex items-center font-medium">Espèces</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/50">
          <div>© 2025 Vayeko. Tous droits réservés.</div>
          <div className="flex items-center gap-2"><span>🇹🇬 100% Togolais</span><span>•</span><span>Le Togo à portée de main</span></div>
        </div>
      </div>

      {/* Motif final tout en bas bandeau textile africain vert/jaune/rouge/bleu/noir */}
      <div className="h-3 bg-gradient-to-r from-[#0E9F6E] via-[#FFB800] via-[#E11D48] via-[#06B6D4] via-[#1A2E1A] to-[#7C3AED] opacity-90" />
      <div className="h-1 bg-[#FFB800]" />
    </footer>
  )
}
