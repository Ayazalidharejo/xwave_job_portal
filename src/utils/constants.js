export const ROLES = {
  USER: 'user',
  ADMIN_JOB: 'admin_job',
  ADMIN_RESUME: 'admin_resume',
  ADMIN_AI: 'admin_ai',
  SUPER_ADMIN: 'super_admin',
}

export const DASHBOARD_PATHS = {
  [ROLES.USER]: '/dashboard/user',
  [ROLES.ADMIN_JOB]: '/dashboard/admin/job',
  [ROLES.ADMIN_RESUME]: '/dashboard/admin/resume',
  [ROLES.ADMIN_AI]: '/dashboard/admin/ai',
  [ROLES.SUPER_ADMIN]: '/dashboard/super-admin',
}

export const JOB_STATUS = ['applied', 'interview', 'rejected', 'hired']
export const JOB_PLATFORMS = ['LinkedIn', 'Facebook', 'WhatsApp', 'Email']
