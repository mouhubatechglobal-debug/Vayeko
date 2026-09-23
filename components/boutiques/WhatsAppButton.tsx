import { buildWhatsAppLink } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface WhatsAppButtonProps {
  /** Numéro brut (nettoyé/validé en interne — jamais d'URL externe reçue). */
  phone: string | null | undefined;
  message?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Bouton de contact WhatsApp — le lien wa.me est toujours reconstruit
 * depuis le numéro validé. Si le numéro est invalide, le bouton est masqué
 * plutôt que d'afficher un lien cassé. Fonctionne mobile et desktop.
 */
export function WhatsAppButton({
  phone,
  message = '',
  label = 'Contacter sur WhatsApp',
  size = 'md',
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(phone, message);
  if (!href) return null;

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
  }[size];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center bg-[#25D366] font-bold text-white shadow-md',
        'transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-2',
        sizes,
        className,
      )}
    >
      <Icon name="whatsapp" className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      {label}
    </a>
  );
}
