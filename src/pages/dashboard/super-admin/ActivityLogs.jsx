import { useEffect, useState } from 'react'
import { activityApi } from '../../../services/api'

export function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await activityApi.getLogs({ page: page + 1, limit })
      setLogs(data.logs)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [page])

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Activity Logs</h1>
      <div className="bg-white border border-neutral-200 rounded-saas-lg overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-3 px-4 font-medium text-neutral-700">User</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Role</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Action</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-4 px-4 text-neutral-500">Loading...</td></tr>
            ) : (
              logs.map((row) => (
                <tr key={row._id} className="border-b border-neutral-100">
                  <td className="py-3 px-4 max-w-[160px] truncate">{row.userId?.name ?? '—'}</td>
                  <td className="py-3 px-4">{row.role ?? '—'}</td>
                  <td className="py-3 px-4 max-w-[120px] truncate">{row.action}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-xs sm:text-sm">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-neutral-500">
          Page {page + 1} of {totalPages} · {total} total
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
