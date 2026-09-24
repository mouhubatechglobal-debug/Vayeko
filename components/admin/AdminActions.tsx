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
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [pending, startTransition] = useTransition();

  function onConfirmDeactivate() {
    if (confirmText.trim().toUpperCase() !== 'DESACTIVER') {
      setError('Veuillez taper le mot DESACTIVER pour confirmer.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const { deleteUser } = await import('@/app/admin/actions');
      const result = await deleteUser(profileId);
      if (!result.ok) {
        setError(result.message);
      } else {
        setShowDeactivateModal(false);
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

  function onConfirmPurge() {
    if (confirmText.trim().toUpperCase() !== 'SUPPRIMER') {
      setError('Veuillez taper le mot SUPPRIMER pour confirmer la suppression définitive.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const { purgeUserPermanent } = await import('@/app/admin/actions');
      const result = await purgeUserPermanent(profileId);
      if (!result.ok) {
        setError(result.message);
      } else {
        setShowPurgeModal(false);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* 1. Bouton Désactiver / Réactiver */}
      {isDeleted ? (
        <Button
          size="sm"
          variant="secondary"
          loading={pending}
          onClick={onRestore}
          className="bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1 text-xs font-bold"
        >
          ♻️ Réactiver
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setConfirmText('');
            setError(null);
            setShowDeactivateModal(true);
          }}
          className="border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-1 text-xs font-semibold"
        >
          ⏸️ Désactiver
        </Button>
      )}

      {/* 2. Bouton Supprimer à vie (toujours accessible) */}
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          setConfirmText('');
          setError(null);
          setShowPurgeModal(true);
        }}
        className="bg-red-700 text-white hover:bg-red-800 px-2 py-1 text-xs font-semibold"
        title="Supprimer à vie le compte"
      >
        💥 Supprimer à vie
      </Button>

      {error && <FeedbackTone message={error} />}

      {/* Modale Désactivation */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="text-2xl">⏸️</span>
              <h3 className="text-lg font-extrabold">Désactiver ce compte</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              L'utilisateur ne pourra plus se connecter. Vous pourrez le réactiver à tout moment.
              Pour confirmer, tapez <strong>DESACTIVER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez DESACTIVER"
              className="mt-3 w-full rounded-xl border-2 border-neutral-300 px-3 py-2 text-sm font-bold uppercase tracking-wider focus:border-amber-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2.5">
              <Button size="sm" variant="ghost" disabled={pending} onClick={() => setShowDeactivateModal(false)}>
                Annuler
              </Button>
              <Button
                size="sm"
                variant="secondary"
                loading={pending}
                disabled={confirmText.trim().toUpperCase() !== 'DESACTIVER'}
                onClick={onConfirmDeactivate}
              >
                Confirmer la désactivation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Suppression à vie */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">💥</span>
              <h3 className="text-lg font-extrabold">Supprimer ce compte À VIE</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              <strong>ATTENTION :</strong> Le profil, ses boutiques, ses produits et ses identifiants seront purgés définitivement. S'il revient, il devra recréer un compte de zéro.
              Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="mt-3 w-full rounded-xl border-2 border-red-300 px-3 py-2 text-sm font-bold uppercase tracking-wider focus:border-red-600 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2.5">
              <Button size="sm" variant="ghost" disabled={pending} onClick={() => setShowPurgeModal(false)}>
                Annuler
              </Button>
              <Button
                size="sm"
                variant="danger"
                loading={pending}
                disabled={confirmText.trim().toUpperCase() !== 'SUPPRIMER'}
                onClick={onConfirmPurge}
              >
                Purger définitivement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Old delete user replaced

export function DeleteBusinessButton({ businessId, isDeleted }: { businessId: string; isDeleted?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [pending, startTransition] = useTransition();

  function onConfirmDeactivate() {
    if (confirmText.trim().toUpperCase() !== 'DESACTIVER') {
      setError('Veuillez taper le mot DESACTIVER pour confirmer.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const { deleteBusiness } = await import('@/app/admin/actions');
      const result = await deleteBusiness(businessId);
      if (!result.ok) {
        setError(result.message);
      } else {
        setShowDeactivateModal(false);
      }
    });
  }

  function onRestore() {
    setError(null);
    startTransition(async () => {
      const { restoreBusiness } = await import('@/app/admin/actions');
      const result = await restoreBusiness(businessId);
      if (!result.ok) setError(result.message);
    });
  }

  function onConfirmPurge() {
    if (confirmText.trim().toUpperCase() !== 'SUPPRIMER') {
      setError('Veuillez taper le mot SUPPRIMER pour confirmer la suppression définitive.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const { purgeBusinessPermanent } = await import('@/app/admin/actions');
      const result = await purgeBusinessPermanent(businessId);
      if (!result.ok) {
        setError(result.message);
      } else {
        setShowPurgeModal(false);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* 1. Bouton Désactiver / Réactiver */}
      {isDeleted ? (
        <Button
          size="sm"
          variant="secondary"
          loading={pending}
          onClick={onRestore}
          className="bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1 text-xs font-bold"
        >
          ♻️ Réactiver boutique
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setConfirmText('');
            setError(null);
            setShowDeactivateModal(true);
          }}
          className="border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-1 text-xs font-semibold"
        >
          ⏸️ Désactiver
        </Button>
      )}

      {/* 2. Bouton Supprimer à vie (toujours visible) */}
      <Button
        size="sm"
        variant="danger"
        onClick={() => {
          setConfirmText('');
          setError(null);
          setShowPurgeModal(true);
        }}
        className="bg-red-700 text-white hover:bg-red-800 px-2 py-1 text-xs font-semibold"
        title="Supprimer à vie de la base"
      >
        💥 Supprimer à vie
      </Button>

      {error && <FeedbackTone message={error} />}

      {/* Modale Désactivation Boutique */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="text-2xl">⏸️</span>
              <h3 className="text-lg font-extrabold">Désactiver cette boutique</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              Cette boutique et ses produits ne seront plus visibles sur le site public. Vous pourrez la réactiver plus tard.
              Pour confirmer, tapez <strong>DESACTIVER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez DESACTIVER"
              className="mt-3 w-full rounded-xl border-2 border-neutral-300 px-3 py-2 text-sm font-bold uppercase tracking-wider focus:border-amber-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2.5">
              <Button size="sm" variant="ghost" disabled={pending} onClick={() => setShowDeactivateModal(false)}>
                Annuler
              </Button>
              <Button
                size="sm"
                variant="secondary"
                loading={pending}
                disabled={confirmText.trim().toUpperCase() !== 'DESACTIVER'}
                onClick={onConfirmDeactivate}
              >
                Confirmer la désactivation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Suppression à vie Boutique */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">💥</span>
              <h3 className="text-lg font-extrabold">Supprimer cette boutique À VIE</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              <strong>ATTENTION :</strong> Cette boutique, ses produits associés et ses images seront définitivement effacés de la base de données. Action irréversible !
              Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="mt-3 w-full rounded-xl border-2 border-red-300 px-3 py-2 text-sm font-bold uppercase tracking-wider focus:border-red-600 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2.5">
              <Button size="sm" variant="ghost" disabled={pending} onClick={() => setShowPurgeModal(false)}>
                Annuler
              </Button>
              <Button
                size="sm"
                variant="danger"
                loading={pending}
                disabled={confirmText.trim().toUpperCase() !== 'SUPPRIMER'}
                onClick={onConfirmPurge}
              >
                Purger définitivement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}