import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import CircularProgress from '@mui/material/CircularProgress'
import { adminRequestApi } from '../services/api'
import { ROLES, ROLE_LABELS } from '../constants/roles'

const adminRoles = [ROLES.ADMIN_JOB, ROLES.ADMIN_RESUME, ROLES.ADMIN_AI]

const schema = z.object({
  name: z.string().min(2, 'Name at least 2 characters'),
  email: z.string().email('Invalid email'),
  requestedRole: z.string().refine((v) => adminRoles.includes(v), { message: 'Invalid role' }),
  reason: z.string().optional(),
})

export function RequestAdmin() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', requestedRole: ROLES.ADMIN_JOB, reason: '' },
  })
  const requestedRole = watch('requestedRole')

  const onSubmit = async (data) => {
    setError('')
    try {
      await adminRequestApi.create(data)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed')
    }
  }

  const cardClass = 'w-full max-w-[400px] bg-white border border-neutral-200 rounded-saas-lg p-6 sm:p-8'

  if (success) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-neutral-100">
        <div className={cardClass}>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Request admin access</h1>
          <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-saas mb-4">
            Request submitted. Super Admin will review and approve.
          </div>
          <Link to="/login" className="btn-primary w-full block text-center py-2.5">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100">
      <div className={cardClass}>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Request admin access</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Your request will go to Super Admin for approval. You cannot self-register as admin.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-saas" role="alert">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="req-name" className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input id="req-name" type="text" className={`input-saas w-full ${errors.name ? 'input-saas-error border-red-500' : ''}`} {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="req-email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input id="req-email" type="email" className={`input-saas w-full ${errors.email ? 'input-saas-error border-red-500' : ''}`} {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="req-role" className="block text-sm font-medium text-neutral-700 mb-1">Requested role</label>
            <select
              id="req-role"
              className={`input-saas w-full ${errors.requestedRole ? 'input-saas-error border-red-500' : ''}`}
              value={requestedRole}
              onChange={(e) => setValue('requestedRole', e.target.value)}
            >
              {adminRoles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            {errors.requestedRole && <p className="mt-1 text-sm text-red-600">{errors.requestedRole.message}</p>}
          </div>
          <div>
            <label htmlFor="req-reason" className="block text-sm font-medium text-neutral-700 mb-1">Reason (optional)</label>
            <textarea id="req-reason" rows={2} className="input-saas w-full resize-y" {...register('reason')} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 disabled:opacity-60 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} />
                Submitting...
              </>
            ) : (
              'Submit request'
            )}
          </button>
          <p className="mt-4 text-sm text-neutral-500">
            <Link to="/register" className="text-accent hover:opacity-90">Register as user</Link>
            {' · '}
            <Link to="/login" className="text-accent hover:opacity-90">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
