import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Person from '@mui/icons-material/Person'
import Email from '@mui/icons-material/Email'
import Lock from '@mui/icons-material/Lock'
import School from '@mui/icons-material/School'
import MenuBook from '@mui/icons-material/MenuBook'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppDispatch, useTilt3d } from '../hooks'
import { setCredentials } from '../store/slices/authSlice'
import { getDashboardPathForRole } from '../utils/roleRedirect'
import { authApi } from '../services/api'

const CLASS_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const COURSE_OPTIONS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'uiux', label: 'UI/UX' },
  { value: 'video_editor', label: 'Video Editor' },
]

const schema = z.object({
  name: z.string().min(2, 'Name at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password at least 6 characters'),
  classGrade: z.coerce.number().min(5, 'Select class 5 to 15').max(15),
  courseName: z.enum(['frontend', 'backend', 'uiux', 'video_editor'], { required_error: 'Please select a course' }),
})

export function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { containerRef, cardStyle, parallax } = useTilt3d({ maxTilt: 10, smooth: 0.1, parallaxFactor: 1.2 })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', classGrade: 5, courseName: 'frontend' },
  })
  const classGrade = watch('classGrade')
  const courseName = watch('courseName')

  const onSubmit = async (data) => {
    setSubmitError('')
    try {
      const { data: res } = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        classGrade: data.classGrade,
        courseName: data.courseName,
      })
      dispatch(setCredentials({ user: { _id: res._id, name: res.name, email: res.email, role: res.role, profileImage: res.profileImage || '' }, token: res.token }))
      navigate(getDashboardPathForRole(res.role), { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setSubmitError(msg)
    }
  }

  return (
    <div className="auth-page-3d relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50/50 to-indigo-50/60 min-h-dvh">
      {/* Parallax wrappers + floating background shapes */}
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

      <div ref={containerRef} className="relative z-10 w-full max-w-[480px] mx-auto flex flex-col items-center py-6 px-4">
        <div className="w-full" style={{ perspective: '1200px' }}>
          <div
            style={cardStyle}
            className="w-full rounded-[1.5rem] overflow-hidden bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_32px_64px_-12px_rgba(139,92,246,0.2),0_0_0_1px_rgba(0,0,0,0.04)] transition-shadow duration-300 relative"
          >
            <div className="auth-shine" aria-hidden="true" />
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600" />

            <div className="relative p-8 sm:p-10">
              <div className="text-center mb-6">
                <h1 className="auth-enter auth-enter-1 text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Create account
                </h1>
                <p className="auth-enter auth-enter-2 mt-2 text-sm text-slate-500 max-w-[300px] mx-auto">
                  Self-registration creates a user account. Select your class (5–15) and course.
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="auth-enter auth-enter-4 space-y-2">
                    <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700">
                      Name
                    </label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-violet-500">
                        <Person className="w-5 h-5" />
                      </span>
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="Your name"
                        className={`input-saas pl-14 ${errors.name ? 'input-saas-error border-red-500' : ''}`}
                        {...register('name')}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="auth-enter auth-enter-5 space-y-2">
                    <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-violet-500">
                        <Email className="w-5 h-5" />
                      </span>
                      <input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={`input-saas pl-14 ${errors.email ? 'input-saas-error border-red-500' : ''}`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="auth-enter auth-enter-6 space-y-2">
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-violet-500">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min 6 characters"
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
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="auth-enter auth-enter-7 space-y-2">
                    <label htmlFor="reg-class" className="block text-sm font-semibold text-slate-700">
                      Class (5 to 15)
                    </label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-violet-500">
                        <School className="w-5 h-5" />
                      </span>
                      <select
                        id="reg-class"
                        className={`input-saas pl-14 appearance-none ${errors.classGrade ? 'input-saas-error border-red-500' : ''}`}
                        value={classGrade}
                        onChange={(e) => setValue('classGrade', Number(e.target.value))}
                      >
                        {CLASS_OPTIONS.map((n) => (
                          <option key={n} value={n}>Class {n}</option>
                        ))}
                      </select>
                    </div>
                    {errors.classGrade && <p className="text-sm text-red-600 mt-1">{errors.classGrade.message}</p>}
                  </div>
                  <div className="auth-enter auth-enter-8 space-y-2">
                    <label htmlFor="reg-course" className="block text-sm font-semibold text-slate-700">
                      Course
                    </label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-violet-500">
                        <MenuBook className="w-5 h-5" />
                      </span>
                      <select
                        id="reg-course"
                        className={`input-saas pl-14 appearance-none ${errors.courseName ? 'input-saas-error border-red-500' : ''}`}
                        value={courseName}
                        onChange={(e) => setValue('courseName', e.target.value)}
                      >
                        {COURSE_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.courseName && <p className="text-sm text-red-600 mt-1">{errors.courseName.message}</p>}
                  </div>
                </div>

                <div className="auth-enter auth-enter-9">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} />
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </form>

              <div className="auth-enter auth-enter-10 mt-8 pt-6 border-t border-slate-200/80 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link font-semibold text-indigo-600">
                    Sign in
                  </Link>
                  {' · '}
                  <Link to="/request-admin" className="auth-link font-medium text-indigo-600">
                    Request admin access
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
