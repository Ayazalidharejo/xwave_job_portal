import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAppDispatch } from '../hooks'
import { setCredentials } from '../store/slices/authSlice'
import { getDashboardPathForRole } from '../utils/roleRedirect'
import { authApi } from '../services/api'

const schema = z.object({
  newPassword: z.string().min(6, 'Password at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    setError('')
    if (!token) {
      setError('Invalid reset link. Use the link from your email.')
      return
    }
    try {
      const { data: res } = await authApi.resetPassword(token, data.newPassword)
      dispatch(setCredentials({ user: { _id: res._id, name: res.name, email: res.email, role: res.role }, token: res.token }))
      navigate(getDashboardPathForRole(res.role), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    }
  }

  if (!token) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100">
        <div className="w-full max-w-[400px] auth-card p-6 sm:p-8">
          <div className="p-3 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl mb-4">
            Invalid or missing reset token. Use the link from your email.
          </div>
          <Link to="/forgot-password" className="btn-primary w-full block text-center py-2.5">Request new link</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100">
      <div className="w-full max-w-[400px] auth-card p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Set new password</h1>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-saas" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="reset-new" className="block text-sm font-medium text-neutral-700 mb-1">New password</label>
            <div className="relative">
              <input
                id="reset-new"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`input-saas w-full pr-10 ${errors.newPassword ? 'input-saas-error border-red-500' : ''}`}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label htmlFor="reset-confirm" className="block text-sm font-medium text-neutral-700 mb-1">Confirm password</label>
            <input
              id="reset-confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`input-saas w-full ${errors.confirmPassword ? 'input-saas-error border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 disabled:opacity-60">
            Reset password
          </button>
        </form>
        <p className="mt-4 text-sm text-neutral-500">
          <Link to="/login" className="text-accent hover:opacity-90">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
