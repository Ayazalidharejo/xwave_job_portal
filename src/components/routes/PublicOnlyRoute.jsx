import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { getDashboardPathForRole } from '../../utils/roleRedirect'

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth)

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardPathForRole(role)} replace />
  }

  return children
}
