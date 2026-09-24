'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface WhatsAppShareButtonProps {
  title: string;
  url?: string;
  type?: 'boutique' | 'produit' | 'service';
}

/** Bouton de partage direct vers WhatsApp (Discussion ou Statut). */
export function WhatsAppShareButton({ title, url, type = 'boutique' }: WhatsAppShareButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const prefix =
      type === 'produit'
        ? `Découvrez ce produit disponible sur Vayeko : *${title}* !`
        : type === 'service'
          ? `Besoin d'un service de qualité ? Découvrez *${title}* sur Vayeko :`
          : `Retrouvez tous les articles et services de *${title}* sur Vayeko Togo :`;

    const fullMessage = `${prefix}\n\n👉 ${targetUrl}\n\n🇹🇬 _Trouvé sur Vayeko, la plateforme locale du Togo_`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  function handleCopy() {
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105 active:scale-95"
        title="Partager sur WhatsApp ou sur votre Statut"
      >
        <Icon name="whatsapp" className="h-4 w-4 shrink-0" />
        <span>Partager sur mon Statut WhatsApp 📢</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
      >
        <span>{copied ? '✓ Lien copié !' : '🔗 Copier le lien'}</span>
      </button>
    </div>
  );
}
