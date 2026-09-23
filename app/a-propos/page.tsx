import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Notre mission',
  description: 'Vayeko connecte les Togolais aux services, boutiques et produits locaux.',
};

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Notre mission</h1>
      <div className="prose-neutral mt-6 space-y-4 text-neutral-700">
        <p>
          <strong>{SITE_NAME}</strong> — « Le Togo à portée de main » — est une plateforme locale qui
          facilite la rencontre entre les Togolais et les commerces, artisans et prestataires de leur
          région.
        </p>
        <p>
          Notre conviction est simple : le numérique doit d'abord servir l'économie de proximité.
          Sur Vayeko, pas de paiement en ligne compliqué ni d'intermédiaires : vous trouvez le bon
          professionnel, vous consultez ses produits et ses avis, puis vous le contactez directement
          sur WhatsApp.
        </p>
        <h2 className="text-xl font-extrabold text-vayeko-green">Ce que la V1 propose</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Recherche de services et de professionnels par ville et catégorie</li>
          <li>Boutiques et produits avec prix en francs CFA</li>
          <li>Contact direct WhatsApp sécurisé</li>
          <li>Comptes utilisateurs, favoris et avis</li>
          <li>Signalements et modération par notre équipe</li>
          <li>Tableau de bord pour les commerçants et prestataires</li>
        </ul>
        <p>
          Les sections Prix, Immobilier, Emploi et Campus arriveront dans les prochaines versions.
        </p>
      </div>
    </div>
  );
}
