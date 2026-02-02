import { useAppSelector } from '../../../hooks'
import { ROLE_LABELS } from '../../../constants/roles'

export function AIAdminDashboard() {
  const auth = useAppSelector((state) => state.auth)
  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">AI Admin</h1>
      <p className="text-sm text-neutral-500">Welcome, {auth.user?.name} · {ROLE_LABELS[auth.role]}</p>
    </div>
  )
}
