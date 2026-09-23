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
