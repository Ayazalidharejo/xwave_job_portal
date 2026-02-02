import { useEffect, useState } from 'react'
import FilterList from '@mui/icons-material/FilterList'
import LinkIcon from '@mui/icons-material/Link'
import Save from '@mui/icons-material/Save'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setAllApplications, setJobLoading, updateApplicationFeedback } from '../../../store/slices/jobSlice'
import { jobApi } from '../../../services/api'
import { ROLES } from '../../../constants/roles'

const STATUS_LABELS = {
  applied: 'Pending',
  interview: 'Interview',
  rejected: 'Rejected',
  hired: 'Signed / Hired',
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function JobAdminApplications() {
  const dispatch = useAppDispatch()
  const { user, role } = useAppSelector((s) => s.auth)
  const { allApplications, loading } = useAppSelector((s) => s.job)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [filterFromDate, setFilterFromDate] = useState('')
  const [filterToDate, setFilterToDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [feedbackDraft, setFeedbackDraft] = useState({})
  const [savingId, setSavingId] = useState(null)

  const load = () => {
    dispatch(setJobLoading(true))
    const params = {}
    if (filterStatus) params.status = filterStatus
    if (filterPlatform) params.platform = filterPlatform
    if (filterFromDate) params.fromDate = filterFromDate
    if (filterToDate) params.toDate = filterToDate
    jobApi.getAll(params)
      .then(({ data }) => dispatch(setAllApplications(data)))
      .finally(() => dispatch(setJobLoading(false)))
  }

  useEffect(() => {
    load()
  }, [filterStatus, filterPlatform, filterFromDate, filterToDate])

  const clearFilters = () => {
    setFilterStatus('')
    setFilterPlatform('')
    setFilterFromDate('')
    setFilterToDate('')
  }

  const handleFeedbackChange = (id, value) => {
    setFeedbackDraft((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveFeedback = async (id) => {
    const text = feedbackDraft[id] ?? ''
    setSavingId(id)
    try {
      // Include admin information in the feedback
      const feedbackData = {
        adminFeedback: text,
        adminName: user?.name || 'Admin',
        adminRole: role,
        adminId: user?._id
      }
      
      await jobApi.addFeedback(id, feedbackData)
      dispatch(updateApplicationFeedback({ 
        id, 
        adminFeedback: text,
        adminName: user?.name || 'Admin',
        adminRole: role,
        feedbackDate: new Date().toISOString()
      }))
      setFeedbackDraft((prev) => { const next = { ...prev }; delete next[id]; return next })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">All Applications</h1>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary gap-2 ${showFilters || filterStatus || filterPlatform || filterFromDate || filterToDate ? 'ring-2 ring-indigo-500' : ''}`}
        >
          <FilterList className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="card-advanced p-4 mb-4">
          <h2 className="text-sm font-semibold text-zinc-700 mb-3">Filter by date, status, applied via</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-saas w-full">
                <option value="">All</option>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Applied via</label>
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="input-saas w-full">
                <option value="">All</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">From date</label>
              <input type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} className="input-saas w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">To date</label>
              <input type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} className="input-saas w-full" />
            </div>
          </div>
          <button type="button" onClick={clearFilters} className="btn-secondary text-sm">Clear filters</button>
        </div>
      )}

      <div className="card-advanced p-4 sm:p-6 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : allApplications.length === 0 ? (
          <p className="text-sm text-zinc-500">No applications. Change filters or wait for new applications.</p>
        ) : (
          <table className="w-full min-w-[800px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">User</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Date</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Applied via</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Message from user</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Link</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Your response to user</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.map((r) => (
                <tr key={r._id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="py-3 px-3 font-medium text-zinc-800">{r.userId?.name ?? r.userId ?? '—'}</td>
                  <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                  <td className="py-3 px-3">{r.platform}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      r.status === 'hired' ? 'bg-green-100 text-green-800' :
                      r.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-700 max-w-[200px] truncate" title={r.messageContent}>{r.messageContent}</td>
                  <td className="py-3 px-3">
                    {r.link ? (
                      <a href={r.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
                        <LinkIcon className="w-4 h-4 shrink-0" />
                        Open
                      </a>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-2">
                      {r.adminFeedback && (
                        <div className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs">
                          <div className="font-medium">{r.adminFeedback}</div>
                          {r.adminName && (
                            <div className="text-xs text-green-600 mt-1">
                              - {r.adminName} ({r.adminRole})
                            </div>
                          )}
                          {r.feedbackDate && (
                            <div className="text-xs text-green-600">
                              {formatDate(r.feedbackDate)}
                            </div>
                          )}
                          {r.studentReply && (
                            <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded">
                              <div className="text-xs font-medium">Student Reply:</div>
                              <div className="text-xs">{r.studentReply}</div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          placeholder="Reply to user..."
                          value={feedbackDraft[r._id] ?? ''}
                          onChange={(e) => handleFeedbackChange(r._id, e.target.value)}
                          className="input-saas w-full min-w-[160px] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFeedback(r._id)}
                          disabled={savingId === r._id}
                          className="btn-primary text-xs py-1.5 gap-1 self-start disabled:opacity-60"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save response
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
