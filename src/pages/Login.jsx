import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Lock from '@mui/icons-material/Lock'
import Email from '@mui/icons-material/Email'
import { useAppDispatch, useTilt3d } from '../hooks'
import { setCredentials } from '../store/slices/authSlice'
import { getDashboardPathForRole } from '../utils/roleRedirect'
import { authApi } from '../services/api'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || null
  const [submitError, setSubmitError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { containerRef, cardStyle, parallax } = useTilt3d({ maxTilt: 10, smooth: 0.1, parallaxFactor: 1.2 })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setSubmitError('')
    try {
      const { data: res } = await authApi.login(data.email, data.password)
      dispatch(setCredentials({ user: { _id: res._id, name: res.name, email: res.email, role: res.role, profileImage: res.profileImage || '' }, token: res.token }))
      const redirectTo = from || getDashboardPathForRole(res.role)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setSubmitError(msg)
    }
  }

  return (
    <div className="auth-page-3d relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-50/60 min-h-dvh">
      {/* Parallax wrappers + floating background shapes (motion-detector feel) */}
      <div
        className="absolute transition-transform duration-200 will-change-transform"
        style={{ transform: `translate(${parallax.x * 0.8}px, ${parallax.y * 0.8}px)`, top: '-10%', right: '-5%' }}
        aria-hidden="true"
      >
        <div className="auth-bg-shape auth-bg-shape-1 auth-float-1" />
      </div>
      <div
        className="absolute transition-transform duration-200 will-change-transform"
        style={{ transform: `translate(${-parallax.x * 0.6}px, ${-parallax.y * 0.6}px)`, bottom: '-5%', left: '-8%' }}
        aria-hidden="true"
      >
        <div className="auth-bg-shape auth-bg-shape-2 auth-float-2" />
      </div>
      <div
        className="absolute transition-transform duration-200 will-change-transform"
        style={{ transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)`, top: '50%', left: '20%' }}
        aria-hidden="true"
      >
        <div className="auth-bg-shape auth-bg-shape-3 auth-float-3" />
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-[440px] mx-auto flex flex-col items-center px-4">
        <div className="w-full" style={{ perspective: '1200px' }}>
          <div
            style={cardStyle}
            className="w-full rounded-[1.5rem] overflow-hidden bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_32px_64px_-12px_rgba(99,102,241,0.2),0_0_0_1px_rgba(0,0,0,0.04)] transition-shadow duration-300 relative"
          >
            {/* Subtle 3D shine overlay */}
            <div className="auth-shine" aria-hidden="true" />

            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600" />

            <div className="relative p-8 sm:p-10">
              <div className="text-center mb-8">
                <h1 className="auth-enter auth-enter-1 text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Sign in
                </h1>
                <p className="auth-enter auth-enter-2 mt-2 text-sm text-slate-500 max-w-[280px] mx-auto">
                  Single login for all roles. You will be redirected by your role.
                </p>
              </div>

              {submitError && (
                <div
                  className="auth-enter auth-enter-3 mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl text-center"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="auth-enter auth-enter-4 space-y-2">
                  <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-indigo-500">
                      <Email className="w-5 h-5" />
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={`input-saas pl-14 pr-4 ${errors.email ? 'input-saas-error border-red-500' : ''}`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="auth-enter auth-enter-5 space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-indigo-500">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`input-saas pl-14 pr-12 ${errors.password ? 'input-saas-error border-red-500' : ''}`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="auth-enter auth-enter-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 active:translate-y-0"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div className="auth-enter auth-enter-7 mt-8 pt-6 border-t border-slate-200/80 space-y-3 text-center">
                <p className="text-sm text-slate-500">
                  <Link to="/forgot-password" className="auth-link font-medium text-indigo-600">
                    Forgot password?
                  </Link>
                </p>
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="auth-link font-semibold text-indigo-600">
                    Register
                  </Link>
                  {' · '}
                  <Link to="/request-admin" className="auth-link font-medium text-indigo-600">
                    Request admin
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
