import { Link } from 'react-router-dom'
import WorkOutline from '@mui/icons-material/WorkOutline'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import Assignment from '@mui/icons-material/Assignment'
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined'
import { useAppSelector } from '../hooks'

const FEATURES = [
  { icon: DescriptionOutlined, label: 'Resume Builder', desc: 'Create and edit your resume with blocks, PDF download, and templates.' },
  { icon: Assignment, label: 'Portfolio Builder', desc: 'Build your portfolio and advanced portfolio pages.' },
  { icon: WorkOutline, label: 'Job Applications', desc: 'Track and manage your job applications.' },
  { icon: SmartToyOutlined, label: 'AI Replies', desc: 'Get AI-powered suggestions for LinkedIn and job replies.' },
]

export function BasicDashboard() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-50 to-white">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-zinc-900">XWave Job Portal</span>
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary py-2 px-4 text-sm">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <section className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">XWave Job Portal</h1>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
            One place to build your resume, portfolio, track job applications, and get AI-powered reply suggestions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-zinc-800 mb-6">What you can do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.label}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-900">{f.label}</h3>
                      <p className="text-sm text-zinc-600 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-semibold text-zinc-800 mb-4">Get started</h2>
          <p className="text-zinc-600 mb-6">
            Create an account to use Resume Builder, Portfolio, Job Applications, and AI Replies. Admins can manage jobs, resumes, and AI settings.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary py-2.5 px-5">Create account</Link>
              <Link to="/login" className="btn-secondary py-2.5 px-5">Login</Link>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">
        <p>XWave Job Portal — Resume, Portfolio, Jobs & AI Replies</p>
      </footer>
    </div>
  )
}
