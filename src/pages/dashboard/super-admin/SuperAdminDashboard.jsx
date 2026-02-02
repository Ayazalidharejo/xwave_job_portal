import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../hooks'
import { ROLE_LABELS } from '../../../constants/roles'
import { statsApi } from '../../../services/api'
import People from '@mui/icons-material/People'
import WorkOutline from '@mui/icons-material/WorkOutline'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import PendingActions from '@mui/icons-material/PendingActions'
import History from '@mui/icons-material/History'
import TrendingUp from '@mui/icons-material/TrendingUp'

const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  rejected: 'Rejected',
  hired: 'Hired',
}

export function SuperAdminDashboard() {
  const { user, role } = useAppSelector((s) => s.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    statsApi
      .get()
      .then(({ data }) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load stats')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="w-full min-w-0 flex items-center justify-center py-24">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-48 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-32 bg-neutral-100 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-w-0 p-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      </div>
    )
  }

  const maxActivity = Math.max(1, ...(stats?.activity?.byDay?.map((d) => d.count) ?? []))

  return (
    <div className="w-full min-w-0 max-w-content mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Super Admin</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Welcome, {user?.name} · {ROLE_LABELS[role]}
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.users?.total ?? 0}
          icon={People}
          to="/dashboard/super-admin/users"
          color="indigo"
        />
        <StatCard
          title="Job Applications"
          value={stats?.applications?.total ?? 0}
          icon={WorkOutline}
          color="emerald"
        />
        <StatCard
          title="Resumes"
          value={stats?.resumes?.total ?? 0}
          icon={DescriptionOutlined}
          color="violet"
        />
        <StatCard
          title="Pending Admin Requests"
          value={stats?.adminRequests?.pending ?? 0}
          icon={PendingActions}
          to="/dashboard/super-admin/requests"
          color="amber"
          highlight
        />
        <StatCard
          title="Activity Logs"
          value={stats?.activity?.total ?? 0}
          icon={History}
          to="/dashboard/super-admin/activity"
          color="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity chart (last 14 days) */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-neutral-900">Activity (last 14 days)</h2>
          </div>
          <div className="h-48 flex items-end gap-1">
            {(stats?.activity?.byDay ?? []).length === 0 ? (
              <p className="text-sm text-neutral-400 self-center">No activity data yet.</p>
            ) : (
              (stats?.activity?.byDay ?? []).map((day) => (
                <div
                  key={day._id}
                  className="flex-1 min-w-0 flex flex-col items-center gap-1 group"
                  title={`${day._id}: ${day.count}`}
                >
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-300 hover:from-indigo-500 hover:to-indigo-300"
                    style={{ height: `${Math.max(4, (day.count / maxActivity) * 100)}%` }}
                  />
                  <span className="text-[10px] text-neutral-400 truncate max-w-full hidden sm:block">
                    {day._id.slice(5)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Applications by status */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Applications by status</h2>
          <div className="space-y-3">
            {['applied', 'interview', 'rejected', 'hired'].map((status) => {
              const count = stats?.applications?.byStatus?.[status] ?? 0
              const total = stats?.applications?.total || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-700 w-24">
                    {STATUS_LABELS[status]}
                  </span>
                  <div className="flex-1 h-8 rounded-lg bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ${
                        status === 'hired'
                          ? 'bg-emerald-500'
                          : status === 'interview'
                            ? 'bg-amber-500'
                            : status === 'rejected'
                              ? 'bg-red-400'
                              : 'bg-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-600 w-10">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Users by role */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Users by role</h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(stats?.users?.byRole ?? {}).map(([roleKey, count]) => (
            <div
              key={roleKey}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100"
            >
              <span className="text-sm font-medium text-neutral-700">
                {ROLE_LABELS[roleKey] ?? roleKey}
              </span>
              <span className="text-sm font-bold text-indigo-600">{count}</span>
            </div>
          ))}
          {Object.keys(stats?.users?.byRole ?? {}).length === 0 && (
            <p className="text-sm text-neutral-400">No users yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, to, color, highlight }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 text-white',
    emerald: 'from-emerald-500 to-emerald-600 text-white',
    violet: 'from-violet-500 to-violet-600 text-white',
    amber: 'from-amber-500 to-amber-600 text-white',
    sky: 'from-sky-500 to-sky-600 text-white',
  }
  const cls = colorClasses[color] ?? colorClasses.indigo
  const content = (
    <>
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cls} shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-neutral-900 mt-0.5 tabular-nums">{value}</p>
      </div>
    </>
  )
  const cardClass = `rounded-2xl border bg-white p-5 shadow-soft flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
    highlight ? 'border-amber-200 ring-1 ring-amber-100' : 'border-neutral-200'
  }`
  if (to) {
    return (
      <Link to={to} className={cardClass}>
        {content}
      </Link>
    )
  }
  return <div className={cardClass}>{content}</div>
}
