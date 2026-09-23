'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import {
  moderateReview,
  resolveReport,
  setBusinessStatus,
  setUserRole,
} from '@/app/admin/actions';
import type { BusinessStatus, ProfileRole } from '@/types/database';

function FeedbackTone({ message }: { message: string }) {
  return (
    <p role="status" className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-vayeko-red">
      {message}
    </p>
  );
}

/** Actions de statut sur un commerce (valider / suspendre). */
export function BusinessStatusActions({ businessId, current }: { businessId: string; current: BusinessStatus }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(status: BusinessStatus) {
    setError(null);
    startTransition(async () => {
      const result = await setBusinessStatus({ business_id: businessId, status });
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {current !== 'active' && (
        <Button size="sm" variant="secondary" loading={pending} onClick={() => run('active')}>
          Valider
        </Button>
      )}
      {current !== 'suspended' && (
        <Button size="sm" variant="danger" loading={pending} onClick={() => run('suspended')}>
          Suspendre
        </Button>
      )}
      {error && <FeedbackTone message={error} />}
    </div>
  );
}

/** Sélecteur de rôle utilisateur. */
export function UserRoleSelect({ profileId, current }: { profileId: string; current: ProfileRole }) {
  const [role, setRole] = useState<ProfileRole>(current);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onChange(next: ProfileRole) {
    const previous = role;
    setRole(next);
    setError(null);
    startTransition(async () => {
      const result = await setUserRole({ profile_id: profileId, role: next });
      if (!result.ok) {
        setRole(previous);
        setError(result.message);
      }
    });
  }

  return (
    <div>
      <select
        aria-label="Changer le rôle"
        value={role}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as ProfileRole)}
        className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm shadow-sm disabled:opacity-60"
      >
        <option value="user">Utilisateur</option>
        <option value="merchant">Commerçant</option>
        <option value="provider">Prestataire</option>
        <option value="admin">Administrateur</option>
      </select>
      {error && <FeedbackTone message={error} />}
    </div>
  );
}

/** Résolution d'un signalement. */
export function ResolveReportActions({ reportId }: { reportId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(status: 'resolved' | 'rejected') {
    setError(null);
    startTransition(async () => {
      const result = await resolveReport({ report_id: reportId, status });
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" loading={pending} onClick={() => run('resolved')}>
        Marquer résolu
      </Button>
      <Button size="sm" variant="ghost" loading={pending} onClick={() => run('rejected')}>
        Rejeter
      </Button>
      {error && <FeedbackTone message={error} />}
    </div>
  );
}

/** Modération d'un avis. */
export function ModerateReviewActions({ reviewId }: { reviewId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(status: 'published' | 'rejected') {
    setError(null);
    startTransition(async () => {
      const result = await moderateReview({ review_id: reviewId, status });
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="danger" loading={pending} onClick={() => run('rejected')}>
        Rejeter l'avis
      </Button>
      {error && <FeedbackTone message={error} />}
    </div>
  );
}

/** Bouton de suppression d'un utilisateur par l'admin. */
export function DeleteUserButton({ profileId, isDeleted }: { profileId: string; isDeleted?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [pending, startTransition] = useTransition();

  function onConfirmDelete() {
    if (confirmText.trim().toUpperCase() !== 'SUPPRIMER') {
      setError('Veuillez taper le mot SUPPRIMER pour confirmer.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const { deleteUser } = await import('@/app/admin/actions');
      const result = await deleteUser(profileId);
      if (!result.ok) {
        setError(result.message);
      } else {
        setShowModal(false);
      }
    });
  }

  function onRestore() {
    setError(null);
    startTransition(async () => {
      const { restoreUser } = await import('@/app/admin/actions');
      const result = await restoreUser(profileId);
      if (!result.ok) setError(result.message);
    });
  }

  if (isDeleted) {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="secondary"
          loading={pending}
          onClick={onRestore}
          className="bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1 text-xs font-bold"
        >
          ♻️ Réactiver le compte
        </Button>
        {error && <FeedbackTone message={error} />}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          setConfirmText('');
          setError(null);
          setShowModal(true);
        }}
        className="px-2.5 py-1 text-xs font-semibold shadow-sm"
      >
        🗑️ Désactiver
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-extrabold">Confirmer la désactivation</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              Cet utilisateur ne pourra plus se connecter à la plateforme.
              Pour éviter toute erreur involontaire, tapez <strong>SUPPRIMER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="mt-3 w-full rounded-xl border-2 border-neutral-300 px-3 py-2 text-sm font-bold uppercase tracking-wider focus:border-red-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2.5">
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                variant="danger"
                loading={pending}
                disabled={confirmText.trim().toUpperCase() !== 'SUPPRIMER'}
                onClick={onConfirmDelete}
              >
                Confirmer la désactivation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Bouton de suppression d'une boutique par l'admin. */
export function DeleteBusinessButton({ businessId }: { businessId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [pending, startTransition] = useTransition();

  function onConfirmDelete() {
    if (confirmText.trim().toUpperCase() !== 'SUPPRIMER') {
      setError('Veuillez taper le mot SUPPRIMER pour confirmer.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const { deleteBusiness } = await import('@/app/admin/actions');
      const result = await deleteBusiness(businessId);
      if (!result.ok) {
        setError(result.message);
      } else {
        setShowModal(false);
      }
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          setConfirmText('');
          setError(null);
          setShowModal(true);
        }}
        className="px-2.5 py-1 text-xs font-semibold shadow-sm"
      >
        🗑️ Supprimer boutique
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-extrabold">Supprimer cette boutique</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              Cette boutique et ses produits ne seront plus visibles sur Vayeko.
              Pour éviter toute erreur involontaire, tapez <strong>SUPPRIMER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="mt-3 w-full rounded-xl border-2 border-neutral-300 px-3 py-2 text-sm font-bold uppercase tracking-wider focus:border-red-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2.5">
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                variant="danger"
                loading={pending}
                disabled={confirmText.trim().toUpperCase() !== 'SUPPRIMER'}
                onClick={onConfirmDelete}
              >
                Confirmer la suppression
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
