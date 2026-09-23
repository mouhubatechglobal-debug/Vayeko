import { describe, expect, it } from 'vitest';
import {
  canAccessAdmin,
  canAccessDashboard,
  canEditContent,
  canManageBusiness,
  canReview,
  isProfileRole,
} from '@/lib/permissions';

describe('canAccessAdmin', () => {
  it('autorise uniquement le rôle admin', () => {
    expect(canAccessAdmin('admin')).toBe(true);
    expect(canAccessAdmin('user')).toBe(false);
    expect(canAccessAdmin('merchant')).toBe(false);
    expect(canAccessAdmin('provider')).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
    expect(canAccessAdmin(undefined)).toBe(false);
  });
});

describe('canAccessDashboard', () => {
  it('autorise commerçant, prestataire et admin', () => {
    expect(canAccessDashboard('merchant')).toBe(true);
    expect(canAccessDashboard('provider')).toBe(true);
    expect(canAccessDashboard('admin')).toBe(true);
  });
  it('refuse l’utilisateur standard (l’URL seule ne suffit jamais)', () => {
    expect(canAccessDashboard('user')).toBe(false);
    expect(canAccessDashboard(null)).toBe(false);
  });
});

describe('canManageBusiness / canEditContent', () => {
  it('owner et manager gèrent, editor édite seulement', () => {
    expect(canManageBusiness('owner')).toBe(true);
    expect(canManageBusiness('manager')).toBe(true);
    expect(canManageBusiness('editor')).toBe(false);
    expect(canEditContent('editor')).toBe(true);
  });
});

describe('canReview', () => {
  it('exige un utilisateur authentifié', () => {
    expect(canReview('user-id')).toBe(true);
    expect(canReview(null)).toBe(false);
    expect(canReview('')).toBe(false);
  });
});

describe('isProfileRole', () => {
  it('valide les rôles connus uniquement', () => {
    expect(isProfileRole('admin')).toBe(true);
    expect(isProfileRole('super-admin')).toBe(false);
    expect(isProfileRole(42)).toBe(false);
  });
});
