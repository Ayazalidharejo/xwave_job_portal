import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../hooks'

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
