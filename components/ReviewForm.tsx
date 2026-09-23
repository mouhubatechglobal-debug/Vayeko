'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { submitReview } from '@/app/actions';
import type { ReviewInput } from '@/lib/validations';

interface ReviewFormProps {
  target: ReviewInput['target'];
  businessId?: string;
  productId?: string;
  serviceId?: string;
  isAuthenticated: boolean;
}

/** Formulaire d'avis (note + commentaire) via Server Action. */
export function ReviewForm({ target, businessId, productId, serviceId, isAuthenticated }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <p className="rounded-xl bg-vayeko-green/5 px-4 py-3 text-sm text-vayeko-green">
        <a href="/connexion" className="font-bold underline">
          Connectez-vous
        </a>{' '}
        pour laisser un avis.
      </p>
    );
  }

  function onSubmit() {
    setMessage(null);
    startTransition(async () => {
      const result = await submitReview({
        target,
        business_id: businessId,
        product_id: productId,
        service_id: serviceId,
        rating,
        comment,
      });
      if (result.ok) {
        setMessage({ kind: 'ok', text: 'Merci pour votre avis !' });
        setComment('');
      } else {
        setMessage({ kind: 'err', text: result.message });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <h3 className="font-bold text-vayeko-green">Laisser un avis</h3>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Note de 1 à 5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={rating === i}
            aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i)}
            className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vayeko-yellow"
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-7 w-7 transition ${i <= (hover || rating) ? 'fill-vayeko-yellow-dark' : 'fill-neutral-300'}`}
            >
              <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" />
            </svg>
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Textarea
          label="Votre commentaire"
          placeholder="Partagez votre expérience…"
          value={comment}
          maxLength={1000}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      {comment.trim().length > 0 && comment.trim().length < 5 && (
        <p className="mt-1 text-xs text-vayeko-red">Commentaire trop court (5 caractères minimum).</p>
      )}
      {message && (
        <p
          role="status"
          className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
            message.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-vayeko-red'
          }`}
        >
          {message.text}
        </p>
      )}
      <div className="mt-4">
        <Button loading={pending} disabled={comment.trim().length < 5} onClick={onSubmit}>
          Publier mon avis
        </Button>
      </div>
    </div>
  );
}
