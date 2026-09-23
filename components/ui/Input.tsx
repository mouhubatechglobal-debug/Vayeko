import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/** Champ texte avec label accessible et message d'erreur. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-vayeko-green">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-xl border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400',
          'bg-white shadow-sm transition focus:outline-none focus:ring-2',
          error
            ? 'border-vayeko-red focus:border-vayeko-red focus:ring-vayeko-red/30'
            : 'border-neutral-300 focus:border-vayeko-green focus:ring-vayeko-green/30',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs font-medium text-vayeko-red">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
});
