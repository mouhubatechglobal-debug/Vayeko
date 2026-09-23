import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme Vayeko (V1).",
};

export default function ConditionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Conditions d'utilisation</h1>
      <p className="mt-2 text-sm text-neutral-500">Dernière mise à jour : septembre 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-700">
        <h2 className="text-lg font-extrabold text-vayeko-green">1. Objet</h2>
        <p>
          Vayeko est une plateforme de mise en relation entre des utilisateurs et des commerçants,
          artisans ou prestataires localisés au Togo. La plateforme n'est pas partie aux transactions
          : les échanges se font directement entre utilisateurs et vendeurs/prestataires.
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">2. Contenus publiés</h2>
        <p>
          Les commerçants et prestataires sont responsables des informations qu'ils publient (prix,
          disponibilités, photos). Tout contenu frauduleux, illégal ou trompeur est interdit et peut
          entraîner la suspension du compte.
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">3. Apprentissage entre utilisateurs</h2>
        <p>
          Les avis doivent être sincères et courtois. La modération de Vayeko peut retirer tout avis
          insultant, diffamatoire ou hors sujet, ainsi que tout contenu signalé à plusieurs reprises.
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">4. Responsabilité</h2>
        <p>
          Vayeko met tout en œuvre pour vérifier les nouveaux commerces, mais ne peut garantir la
          qualité des produits ou services vendus par des tiers. Restez vigilant : ne payez jamais
          à distance un vendeur inconnu sans garanties.
        </p>
        <h2 className="text-lg font-extrabold text-vayeko-green">5. Compte</h2>
        <p>
          Vous êtes responsable de la confidentialité de votre mot de passe. Signalez-nous toute
          utilisation suspecte de votre compte depuis la page de signalement.
        </p>
      </div>
    </div>
  );
}
