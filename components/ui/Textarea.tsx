import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, rows = 4, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-vayeko-green">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
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
        <p role="alert" className="mt-1 text-xs font-medium text-vayeko-red">
          {error}
        </p>
      )}
    </div>
  );
});
