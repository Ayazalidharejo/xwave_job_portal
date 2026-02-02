import { Link } from 'react-router-dom'
import Block from '@mui/icons-material/Block'

export function Unauthorized() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-neutral-100">
      <div className="text-center max-w-[400px] w-full">
        <Block className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Access denied</h1>
        <p className="text-sm text-neutral-500 mb-6">
          You don&apos;t have permission to view this page.
        </p>
        <Link to="/login" className="btn-primary inline-block py-2.5 px-6">
          Back to Login
        </Link>
      </div>
    </div>
  )
}
