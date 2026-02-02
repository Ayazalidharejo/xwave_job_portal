import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import CircularProgress from '@mui/material/CircularProgress'
import { authApi } from '../services/api'

const schema = z.object({ email: z.string().email('Invalid email') })

export function ForgotPassword() {
  const [success, setSuccess] = useState(false)
  const [resetLink, setResetLink] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    setError('')
    try {
      const { data: res } = await authApi.forgotPassword(data.email)
      setSuccess(true)
      setResetLink(res.resetLink || '')
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed')
    }
  }

  if (success) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-neutral-100">
        <div className="w-full max-w-[400px] bg-white border border-neutral-200 rounded-saas-lg p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Forgot password</h1>
          <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-saas mb-4">
            If that email exists, a reset link has been generated. Use the link below to set a new password.
          </div>
          {resetLink ? (
            <div className="mb-6">
              <a
                href={resetLink}
                className="btn-primary w-full block text-center py-2.5 no-underline"
              >
                Open reset password link
              </a>
              <p className="text-xs text-neutral-500 mt-2 break-all">
                Or copy: {resetLink}
              </p>
            </div>
          ) : (
            <p className="text-sm text-neutral-500 mb-4">
              If that email exists, a reset link has been sent.
            </p>
          )}
          <Link to="/login" className="btn-secondary w-full block text-center py-2.5">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100">
      <div className="w-full max-w-[400px] auth-card p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Forgot password</h1>
        <p className="text-sm text-neutral-500 mb-6">Enter your email. We will send you a reset link (or show it here in dev).</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-saas" role="alert">
              {error}
            </div>
          )}
          <label htmlFor="forgot-email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            className="input-saas w-full mb-4"
            {...register('email')}
          />
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 disabled:opacity-60 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </button>
          <p className="mt-4 text-sm text-neutral-500">
            <Link to="/login" className="text-accent hover:opacity-90">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
