'use client';

import { useState, useTransition } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';
import { submitReport } from '@/app/actions';
import type { ReportInput } from '@/lib/validations';

interface ReportDialogProps {
  target: ReportInput['target'];
  businessId?: string;
  productId?: string;
  serviceId?: string;
  reviewId?: string;
  reportedProfileId?: string;
}

/**
 * Bouton « Signaler » + modale. Soumet via une Server Action
 * (session + Zod vérifiés côté serveur).
 */
export function ReportDialog(props: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    setMessage(null);
    startTransition(async () => {
      const result = await submitReport({
        target: props.target,
        business_id: props.businessId,
        product_id: props.productId,
        service_id: props.serviceId,
        review_id: props.reviewId,
        reported_profile_id: props.reportedProfileId,
        reason,
        details: details || undefined,
      });
      if (result.ok) {
        setMessage({ kind: 'ok', text: 'Merci ! Votre signalement a été transmis à notre équipe.' });
        setReason('');
        setDetails('');
        setTimeout(() => setOpen(false), 1600);
      } else {
        setMessage({ kind: 'err', text: result.message });
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-500 transition hover:bg-vayeko-red/10 hover:text-vayeko-red"
      >
        <Icon name="flag" className="h-3.5 w-3.5" />
        Signaler
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Signaler ce contenu">
        <p className="mb-4 text-sm text-neutral-600">
          Décrivez le problème (arnaque, contenu inapproprié, information fausse…). Notre équipe
          examinera votre signalement.
        </p>
        <div className="space-y-3">
          <Input
            label="Motif"
            placeholder="Ex. Arnaque suspectée"
            value={reason}
            maxLength={80}
            onChange={(e) => setReason(e.target.value)}
          />
          <Textarea
            label="Détails (facultatif)"
            placeholder="Précisez le contexte…"
            value={details}
            maxLength={1000}
            onChange={(e) => setDetails(e.target.value)}
          />
          {reason.trim().length > 0 && reason.trim().length < 4 && (
            <p className="text-xs text-vayeko-red">Le motif doit contenir au moins 4 caractères.</p>
          )}
        </div>
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
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Annuler
          </Button>
          <Button variant="danger" loading={pending} disabled={reason.trim().length < 4} onClick={onSubmit}>
            Envoyer le signalement
          </Button>
        </div>
      </Modal>
    </>
  );
}
