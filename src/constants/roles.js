export const ROLES = {
  USER: 'user',
  ADMIN_JOB: 'admin_job',
  ADMIN_RESUME: 'admin_resume',
  ADMIN_AI: 'admin_ai',
  SUPER_ADMIN: 'super_admin',
}

export const ROLE_LABELS = {
  [ROLES.USER]: 'User',
  [ROLES.ADMIN_JOB]: 'Job Admin',
  [ROLES.ADMIN_RESUME]: 'Resume Admin',
  [ROLES.ADMIN_AI]: 'AI Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin',
}

/** Dashboard path for each role */
export const DASHBOARD_PATHS = {
  [ROLES.USER]: '/dashboard/user',
  [ROLES.ADMIN_JOB]: '/dashboard/admin/job',
  [ROLES.ADMIN_RESUME]: '/dashboard/admin/resume',
  [ROLES.ADMIN_AI]: '/dashboard/admin/ai',
  [ROLES.SUPER_ADMIN]: '/dashboard/super-admin',
}
