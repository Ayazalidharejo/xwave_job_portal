import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../hooks'
import { ROLE_LABELS } from '../../../constants/roles'
import { jobApi } from '../../../services/api'

const STATUS_LABELS = { applied: 'Applied', interview: 'Interview', rejected: 'Rejected', hired: 'Hired' }

export function JobAdminDashboard() {
  const auth = useAppSelector((state) => state.auth)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobApi.getAll().then(({ data }) => setApplications(Array.isArray(data) ? data : [])).finally(() => setLoading(false))
  }, [])

  const byStatus = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})
  const total = applications.length

  return (
    <div className="w-full min-w-0 max-w-content mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Job Admin</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Welcome, {auth.user?.name} · {ROLE_LABELS[auth.role]}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['applied', 'interview', 'rejected', 'hired'].map((status) => (
          <div
            key={status}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft flex items-center justify-between"
          >
            <span className="text-sm font-medium text-neutral-600">{STATUS_LABELS[status]}</span>
            <span className="text-xl font-bold text-neutral-900 tabular-nums">
              {loading ? '—' : byStatus[status] ?? 0}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Applications report</h2>
        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : (
          <div className="space-y-3">
            {['applied', 'interview', 'rejected', 'hired'].map((status) => {
              const count = byStatus[status] ?? 0
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-700 w-24">{STATUS_LABELS[status]}</span>
                  <div className="flex-1 h-8 rounded-lg bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-lg bg-indigo-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-600 w-12">{count}</span>
                </div>
              )
            })}
          </div>
        )}
        <p className="mt-4 text-sm text-neutral-500">
          <Link to="/dashboard/admin/job/applications" className="text-indigo-600 font-medium hover:underline">
            View all applications →
          </Link>
        </p>
      </div>
    </div>
  )
}
