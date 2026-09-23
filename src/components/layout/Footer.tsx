import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#1A2E1A] text-white mt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-[#0E9F6E] flex items-center justify-center font-bold text-lg">V</div>
              <div>
                <div className="font-bold text-lg leading-none">Vayeko</div>
                <div className="text-[10px] text-[#86EFAC] tracking-wide">LE TOGO À PORTÉE DE MAIN</div>
              </div>
            </div>
            <p className="text-sm text-[#A8C5A8] leading-relaxed max-w-[320px]">
              La plateforme tout-en-un qui centralise services, commerces, immobilier, emploi et annonces au Togo. 
              Recherchez, comparez, contactez, commandez.
            </p>
            <div className="flex gap-2 mt-6">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0E9F6E] cursor-pointer transition-colors">f</div>
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0E9F6E] cursor-pointer transition-colors">𝕏</div>
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] cursor-pointer transition-colors">W</div>
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0E9F6E] cursor-pointer transition-colors">in</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Explorer</h4>
            <ul className="space-y-2.5 text-sm text-[#A8C5A8]">
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/boutiques" className="hover:text-white">Boutiques</Link></li>
              <li><Link href="/comparateur" className="hover:text-white">Comparateur de prix</Link></li>
              <li><Link href="/immobilier" className="hover:text-white">Immobilier</Link></li>
              <li><Link href="/emploi" className="hover:text-white">Emploi</Link></li>
              <li><Link href="/campus" className="hover:text-white">Campus</Link></li>
              <li><Link href="/annonces" className="hover:text-white">Annonces</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Villes</h4>
            <ul className="space-y-2.5 text-sm text-[#A8C5A8]">
              <li><Link href="/recherche?ville=Lomé" className="hover:text-white">Lomé</Link></li>
              <li><Link href="/recherche?ville=Sokodé" className="hover:text-white">Sokodé</Link></li>
              <li><Link href="/recherche?ville=Kara" className="hover:text-white">Kara</Link></li>
              <li><Link href="/recherche?ville=Atakpamé" className="hover:text-white">Atakpamé</Link></li>
              <li><Link href="/recherche?ville=Kpalimé" className="hover:text-white">Kpalimé</Link></li>
              <li><Link href="/recherche?ville=Dapaong" className="hover:text-white">Dapaong</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Aide & Légal</h4>
            <ul className="space-y-2.5 text-sm text-[#A8C5A8]">
              <li><Link href="/aide" className="hover:text-white">Centre d&apos;aide</Link></li>
              <li><Link href="/devenir-vendeur" className="hover:text-white">Devenir vendeur</Link></li>
              <li><Link href="/conditions" className="hover:text-white">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
            <div className="mt-6">
              <div className="text-xs text-[#86EFAC] font-medium mb-2">Paiement en FCFA</div>
              <div className="flex gap-2">
                <div className="h-7 px-2.5 rounded bg-white/10 text-[11px] flex items-center">Flooz</div>
                <div className="h-7 px-2.5 rounded bg-white/10 text-[11px] flex items-center">TMoney</div>
                <div className="h-7 px-2.5 rounded bg-white/10 text-[11px] flex items-center">Espèces</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-[#86EFAC]">
          <div>© 2026 Vayeko. Tous droits réservés. Fait avec ❤️ au Togo.</div>
          <div className="flex gap-4">
            <span>🇹🇬 100% Togolais</span>
            <span>•</span>
            <span>Disponible à Lomé, Sokodé, Kara, Atakpamé, Kpalimé, Dapaong</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
