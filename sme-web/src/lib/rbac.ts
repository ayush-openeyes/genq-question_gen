import type { Role } from '../context/AuthContext';

export const ROUTE_ROLES: Record<string, Role[]> = {
  '/runs':                   ['PM', 'SME'],
  '/lists':                  ['PM', 'SME'],
  '/generate':               ['PM', 'SME'],
  '/questions/:id/edit':     ['PM', 'SME', 'RE'],
  '/review-queue':           ['OA', 'PM', 'RE'],
  '/assessments/new':        ['OA', 'PM'],
  '/projects':               ['SA', 'OA', 'PM'],
  '/analytics':              ['SA', 'OA', 'PM', 'VI'],
  '/settings/users':         ['SA', 'OA'],
  '/settings/roles':         ['SA', 'OA'],
  '/settings/organization':  ['SA', 'OA'],
  '/settings/audit-log':     ['SA', 'OA'],
  '/settings/integrations':  ['SA', 'OA'],
  '/admin':                  ['SA'],
};

export function hasRouteAccess(path: string, role: Role): boolean {
  const match = Object.keys(ROUTE_ROLES).find(pattern => path.startsWith(pattern));
  return match ? ROUTE_ROLES[match].includes(role) : true;
}
