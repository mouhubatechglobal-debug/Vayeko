import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-b from-vayeko-yellow to-vayeko-yellow-dark text-vayeko-green-dark font-bold shadow-md hover:shadow-lg hover:brightness-105',
  secondary:
    'bg-vayeko-green text-white font-semibold hover:bg-vayeko-green-light',
  outline:
    'border-2 border-vayeko-green text-vayeko-green font-semibold hover:bg-vayeko-green hover:text-white',
  ghost: 'text-vayeko-green font-semibold hover:bg-vayeko-green/5',
  danger: 'bg-vayeko-red text-white font-semibold hover:brightness-95',
  whatsapp:
    'bg-[#25D366] text-white font-bold hover:brightness-95 shadow-md',
};

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

/**
 * Bouton Vayeko — styles cohérents avec la maquette (jaune soleil principal).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
});
