import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { WhatsAppButton } from '@/components/boutiques/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Nous contacter',
  description: `Contactez l'équipe ${SITE_NAME}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-vayeko-green">Nous contacter</h1>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-extrabold text-vayeko-green">Support utilisateurs</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Une question sur votre compte, un avis ou un signalement ? Notre équipe répond du lundi
            au samedi, 8h – 18h (GMT).
          </p>
          <div className="mt-4">
            <WhatsAppButton
              phone="+228 90 00 00 00"
              message={`Bonjour, j'ai une question à propos de ${SITE_NAME}.`}
              label="Contacter le support WhatsApp"
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-extrabold text-vayeko-green">Commerçants & prestataires</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Pour activer votre compte professionnel ou signaler un commerce, écrivez-nous également
            par WhatsApp : notre équipe valide chaque nouvelle boutique.
          </p>
        </div>
      </div>
    </div>
  );
}
