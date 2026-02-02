import { useEffect, useState } from 'react'
import Add from '@mui/icons-material/Add'
import FilterList from '@mui/icons-material/FilterList'
import LinkIcon from '@mui/icons-material/Link'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setMyApplications, addApplication, setJobLoading } from '../../../store/slices/jobSlice'
import { jobApi } from '../../../services/api'
import { StudentReply } from '../../../components/StudentReply'

const APPLIED_VIA_OPTIONS = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Email', label: 'Email' },
  { value: 'WhatsApp', label: 'WhatsApp' },
]

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Signed / Hired' },
]

const METHOD_OPTIONS = [
  { value: 'Form', label: 'Form' },
  { value: 'DM', label: 'DM' },
  { value: 'Email', label: 'Email' },
  { value: 'Other', label: 'Other' },
]

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function JobApplications() {
  const dispatch = useAppDispatch()
  const myApplications = useAppSelector((state) => state.job.myApplications)
  const loading = useAppSelector((state) => state.job.loading)
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState('LinkedIn')
  const [messageContent, setMessageContent] = useState('')
  const [link, setLink] = useState('')
  const [status, setStatus] = useState('applied')
  const [applicationDate, setApplicationDate] = useState('')
  const [email, setEmail] = useState('')
  const [jobLink, setJobLink] = useState('')
  const [method, setMethod] = useState('Form')
  const [emailContent, setEmailContent] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    dispatch(setJobLoading(true))
    const params = {}
    if (filterStatus) params.status = filterStatus
    if (filterPlatform) params.platform = filterPlatform
    jobApi.getMy(params)
      .then((res) => dispatch(setMyApplications(res.data)))
      .finally(() => dispatch(setJobLoading(false)))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    load()
  }, [filterStatus, filterPlatform])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await jobApi.create({ 
        platform, 
        status,
        applicationDate,
        email,
        jobLink,
        method,
        emailContent
      })
      dispatch(addApplication(res.data))
      
      // Reload data to ensure table updates
      load()
      
      setOpen(false)
      setStatus('applied')
      setApplicationDate('')
      setEmail('')
      setJobLink('')
      setMethod('Form')
      setEmailContent('')
      setLink('')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const applyFilters = () => {
    setShowFilters(false)
  }

  const handleStudentReply = async (applicationId, replyText) => {
    try {
      await jobApi.addStudentReply(applicationId, replyText)
      // Reload the applications to show the updated reply
      load()
    } catch (error) {
      console.error('Failed to submit reply:', error)
      throw error
    }
  }

  const clearFilters = () => {
    setFilterStatus('')
    setFilterPlatform('')
  }

  return (
    <div className="w-full min-w-0 my-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6" style={{ marginBottom: '20px' }}>
        <h1 className="text-2xl font-semibold text-zinc-900">Job Applications</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary gap-2 ${showFilters || filterStatus || filterPlatform ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <FilterList className="w-4 h-4" />
            Filters
          </button>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary gap-2">
            <Add className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card-advanced p-4 mb-4">
          <h2 className="text-sm font-semibold text-zinc-700 mb-3">Filter by date, status, and applied via</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-saas w-full"
              >
                <option value="">All</option>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Applied via</label>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="input-saas w-full"
              >
                <option value="">All</option>
                {APPLIED_VIA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={applyFilters} className="btn-primary text-sm">Apply</button>
            <button type="button" onClick={clearFilters} className="btn-secondary text-sm">Clear filters</button>
          </div>
        </div>
      )}

      {open && (
        <div className="mt-4 card-advanced p-4 sm:p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Add Application</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="application-date" className="block text-sm font-medium text-zinc-700 mb-1">Date *</label>
              <input
                id="application-date"
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="input-saas w-full"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">mm/dd/yyyy</p>
            </div>
            <div>
              <label htmlFor="application-email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
              <input
                id="application-email"
                type="email"
                placeholder="Email (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-saas w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="job-link" className="block text-sm font-medium text-zinc-700 mb-1">Job Link *</label>
              <input
                id="job-link"
                type="url"
                placeholder="Job URL & Discussion Link"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                className="input-saas w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="job-status" className="block text-sm font-medium text-zinc-700 mb-1">Status *</label>
              <select
                id="job-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-saas w-full"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="application-method" className="block text-sm font-medium text-zinc-700 mb-1">Method *</label>
              <select
                id="application-method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="input-saas w-full"
              >
                {METHOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="job-applied-via" className="block text-sm font-medium text-zinc-700 mb-1">Applied via</label>
              <select
                id="job-applied-via"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="input-saas w-full"
              >
                {APPLIED_VIA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="email-content" className="block text-sm font-medium text-zinc-700 mb-1">Email Content</label>
              <textarea
                id="email-content"
                rows={3}
                placeholder="Email content (Optional)"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="input-saas w-full resize-y"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!applicationDate || !jobLink || submitting}
              className="btn-primary disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} />
                  Adding...
                </>
              ) : (
                'Add Application'
              )}
            </button>
            <button type="button" onClick={() => { 
              setOpen(false); 
              setStatus('applied');
              setApplicationDate('');
              setEmail('');
              setJobLink('');
              setMethod('Form');
              setEmailContent('');
              setLink('');
            }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card-advanced p-4 sm:p-6 overflow-x-auto mt-6">
        <div className="mb-4">
          <p className="text-xs text-zinc-500">Debug: Loading: {loading.toString()}, Applications: {myApplications.length}</p>
        </div>
        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : myApplications.length === 0 ? (
          <p className="text-sm text-zinc-500">No applications. Add one or change filters.</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Date</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Email</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Job Link</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Method</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Applied via</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Email Content</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Admin response</th>
              </tr>
            </thead>
            <tbody>
              {myApplications.map((r) => (
                <tr key={r._id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">{formatDate(r.applicationDate || r.createdAt)}</td>
                  <td className="py-3 px-3 text-zinc-700">{r.email || '—'}</td>
                  <td className="py-3 px-3">
                    {r.jobLink ? (
                      <a href={r.jobLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
                        <LinkIcon className="w-4 h-4 shrink-0" />
                        Job
                      </a>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      r.status === 'hired' ? 'bg-green-100 text-green-800' :
                      r.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {STATUS_OPTIONS.find((o) => o.value === r.status)?.label ?? r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {r.method || 'Form'}
                    </span>
                  </td>
                  <td className="py-3 px-3">{r.platform}</td>
                  <td className="py-3 px-3 text-zinc-700 max-w-[200px] truncate" title={r.emailContent}>{r.emailContent || '—'}</td>
                  <td className="py-3 px-3 text-zinc-700 max-w-[220px]">
                    {r.adminFeedback ? (
                      <div className="bg-indigo-50 text-indigo-900 px-2 py-1 rounded text-xs">
                        <div className="font-medium">{r.adminFeedback}</div>
                        {r.adminName && (
                          <div className="text-xs text-indigo-600 mt-1">
                            - {r.adminName} ({r.adminRole})
                          </div>
                        )}
                        {r.feedbackDate && (
                          <div className="text-xs text-indigo-600">
                            {formatDate(r.feedbackDate)}
                          </div>
                        )}
                        <StudentReply 
                          application={r} 
                          onReplySubmit={handleStudentReply}
                        />
                      </div>
                    ) : (
                      <span className="text-zinc-400">No response yet</span>
                    )}
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
