import { useAppSelector } from '../../../hooks'
import { ROLE_LABELS } from '../../../constants/roles'

export function ResumeAdminDashboard() {
  const { user, role } = useAppSelector((s) => s.auth)
  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Resume Admin</h1>
      <p className="text-sm text-neutral-500">Welcome, {user?.name} · {ROLE_LABELS[role]}</p>
    </div>
  )
}
