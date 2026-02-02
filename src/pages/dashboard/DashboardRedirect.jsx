import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { getDashboardPathForRole } from '../../utils/roleRedirect'

export function DashboardRedirect() {
  const role = useAppSelector((state) => state.auth.role)
  const path = getDashboardPathForRole(role)
  return <Navigate to={path} replace />
}
