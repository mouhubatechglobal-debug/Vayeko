import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Comment Vayeko protège vos données personnelles (V1).',
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-neutral-500">Dernière mise à jour : septembre 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-700">
        <h2 className="text-lg font-extrabold text-vayeko-green">Données collectées</h2>
        <p>
          Nous collectons uniquement ce qui est nécessaire : nom, adresse e-mail, numéro de téléphone
          / WhatsApp (facultatifs), ainsi que les contenus que vous publiez (favorites, avis,
          établissements gérés).
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">Utilisation</h2>
        <p>
          Vos données servent au fonctionnement de la plateforme : authentification, affichage des
          fiches publiques, favoris et avis. Nous ne revendons pas vos données personnelles à des
          tiers.
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">Sécurité</h2>
        <p>
          Les données sont hébergées chez Supabase (PostgreSQL) avec chiffrement en transit,
          politiques d'accès par ligne (RLS) et journalisation des actions administratives.
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">Vos droits</h2>
        <p>
          Vous pouvez demander la rectification ou la suppression de votre compte à tout moment via
          la page de contact. La suppression est effectuée sous 30 jours (suppression douce des
          données personnelles).
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">Cookies</h2>
        <p>
          Seuls les cookies techniques de session d'authentification sont utilisés. Aucun cookie
          publicitaire ou de pistage tiers n'est déposé par Vayeko en V1.
        </p>
      </div>
    </div>
  );
}
