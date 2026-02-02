import { DASHBOARD_PATHS, ROLES } from '../constants/roles'

/**
 * Returns the dashboard path for the given role.
 * Used after login to redirect user to correct dashboard.
 */
export function getDashboardPathForRole(role) {
  return DASHBOARD_PATHS[role] ?? DASHBOARD_PATHS[ROLES.USER]
}
