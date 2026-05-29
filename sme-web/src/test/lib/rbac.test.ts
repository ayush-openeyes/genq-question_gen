import { describe, it, expect } from 'vitest';
import { hasRouteAccess, ROUTE_ROLES } from '../../lib/rbac';
import type { Role } from '../../context/AuthContext';

describe('hasRouteAccess', () => {
  it('allows SA to access /admin', () => {
    expect(hasRouteAccess('/admin', 'SA')).toBe(true);
  });

  it('blocks PM from /admin', () => {
    expect(hasRouteAccess('/admin', 'PM')).toBe(false);
  });

  it('blocks VI from /admin', () => {
    expect(hasRouteAccess('/admin', 'VI')).toBe(false);
  });

  it('allows all roles on unrestricted routes (/dashboard)', () => {
    const roles: Role[] = ['SA', 'OA', 'PM', 'SME', 'RE', 'VI'];
    for (const role of roles) {
      expect(hasRouteAccess('/dashboard', role)).toBe(true);
    }
  });

  it('allows PM to access /projects', () => {
    expect(hasRouteAccess('/projects', 'PM')).toBe(true);
  });

  it('blocks SME from /projects', () => {
    expect(hasRouteAccess('/projects', 'SME')).toBe(false);
  });

  it('allows prefix match for nested routes like /runs/new', () => {
    expect(hasRouteAccess('/runs/new', 'SME')).toBe(true);
    expect(hasRouteAccess('/runs/new', 'VI')).toBe(false);
  });

  it('allows SA to access /settings/users', () => {
    expect(hasRouteAccess('/settings/users', 'SA')).toBe(true);
  });

  it('blocks RE from /settings/users', () => {
    expect(hasRouteAccess('/settings/users', 'RE')).toBe(false);
  });

  it('ROUTE_ROLES contains all expected restricted paths', () => {
    expect(ROUTE_ROLES).toHaveProperty('/admin');
    expect(ROUTE_ROLES).toHaveProperty('/analytics');
    expect(ROUTE_ROLES).toHaveProperty('/review-queue');
  });
});
