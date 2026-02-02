import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { jobApi } from '../../../services/api'
import Person from '@mui/icons-material/Person'
import Work from '@mui/icons-material/Work'
import Schedule from '@mui/icons-material/Schedule'
import Message from '@mui/icons-material/Message'
import FilterList from '@mui/icons-material/FilterList'
import Reply from '@mui/icons-material/Reply'
import { ROLES } from '../../../constants/roles'

const STATUS_LABELS = {
  applied: { label: 'Applied', color: 'bg-amber-100 text-amber-800' },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
}

const METHOD_LABELS = {
  Form: 'Form',
  DM: 'Direct Message',
  Email: 'Email',
  Other: 'Other',
}

export function Activity() {
  const dispatch = useAppDispatch()
  const { user, role } = useAppSelector((s) => s.auth)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Check if user can access this page (Super Admin or Admins)
  const canAccess = role === ROLES.SUPER_ADMIN || [ROLES.ADMIN_JOB, ROLES.ADMIN_RESUME, ROLES.ADMIN_AI].includes(role)

  const loadApplications = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      if (filterPlatform) params.platform = filterPlatform
      
      const { data } = await jobApi.getAll(params)
      setApplications(data || [])
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    loadApplications()
  }, [filterStatus, filterPlatform])

  const handleFeedbackSubmit = async () => {
    if (!selectedApplication || !feedback.trim()) return

    try {
      console.log('Submitting feedback for application:', selectedApplication._id)
      
      // Include admin information in the feedback
      const feedbackData = {
        adminFeedback: feedback.trim(),
        adminName: user?.name || 'Admin',
        adminRole: role,
        adminId: user?._id
      }
      
      await jobApi.addFeedback(selectedApplication._id, feedbackData)
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === selectedApplication._id 
          ? { 
              ...app, 
              adminFeedback: feedback.trim(),
              adminName: user?.name || 'Admin',
              adminRole: role,
              feedbackDate: new Date().toISOString()
            }
          : app
      ))
      
      setShowFeedbackModal(false)
      setSelectedApplication(null)
      setFeedback('')
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const clearFilters = () => {
    setFilterStatus('')
    setFilterPlatform('')
  }

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Activity & Feedback</h1>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary gap-2 ${showFilters || filterStatus || filterPlatform ? 'ring-2 ring-indigo-500' : ''}`}
        >
          <FilterList className="w-4 h-4" />
          Filters
        </button>
      </div>

      <p className="text-sm text-zinc-500 mb-4">
        View all student job applications and provide feedback to help them succeed.
      </p>

      {/* Filters */}
      {showFilters && (
        <div className="card-advanced p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-saas w-full"
              >
                <option value="">All</option>
                {Object.entries(STATUS_LABELS).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
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
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setShowFilters(false)} className="btn-primary text-sm">Apply</button>
            <button type="button" onClick={clearFilters} className="btn-secondary text-sm">Clear filters</button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="card-advanced p-4 sm:p-6 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-zinc-500">No applications found.</p>
        ) : (
          <table className="w-full min-w-[800px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Student</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Date</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Job Link</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Method</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Platform</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Email Content</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Admin Feedback</th>
                <th className="text-left py-3 px-3 font-semibold text-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Person className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">{application.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-zinc-500">{application.user?.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">
                    {formatDate(application.applicationDate || application.createdAt)}
                  </td>
                  <td className="py-3 px-3">
                    {application.jobLink ? (
                      <a 
                        href={application.jobLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                      >
                        <Work className="w-4 h-4" />
                        View Job
                      </a>
                    ) : (
                      <span className="text-zinc-400">No link</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      STATUS_LABELS[application.status]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {STATUS_LABELS[application.status]?.label || application.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {METHOD_LABELS[application.method] || application.method || 'Form'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                      {application.platform || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="max-w-[200px]">
                      {application.emailContent ? (
                        <div className="text-zinc-700 text-xs truncate" title={application.emailContent}>
                          {application.emailContent}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs">No content</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="max-w-[250px]">
                      {application.adminFeedback ? (
                        <div className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs">
                          <div className="font-medium">{application.adminFeedback}</div>
                          {application.adminName && (
                            <div className="text-xs text-green-600 mt-1">
                              - {application.adminName} ({application.adminRole})
                            </div>
                          )}
                          {application.feedbackDate && (
                            <div className="text-xs text-green-600">
                              {formatDate(application.feedbackDate)}
                            </div>
                          )}
                          {application.studentReply && (
                            <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded">
                              <div className="text-xs font-medium">Student Reply:</div>
                              <div className="text-xs">{application.studentReply}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs">No feedback yet</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        setSelectedApplication(application)
                        setFeedback(application.adminFeedback || '')
                        setShowFeedbackModal(true)
                      }}
                      className="btn-primary text-xs gap-1"
                    >
                      <Reply className="w-3 h-3" />
                      {application.adminFeedback ? 'Edit' : 'Add'} Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">
              Provide Feedback for {selectedApplication.user?.name || 'Student'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Application Details</label>
              <div className="bg-zinc-50 p-3 rounded text-xs space-y-1">
                <div><strong>Job:</strong> {selectedApplication.jobLink ? 'View Job' : 'No link'}</div>
                <div><strong>Status:</strong> {STATUS_LABELS[selectedApplication.status]?.label || selectedApplication.status}</div>
                <div><strong>Platform:</strong> {selectedApplication.platform}</div>
                <div><strong>Method:</strong> {METHOD_LABELS[selectedApplication.method] || selectedApplication.method}</div>
                {selectedApplication.emailContent && (
                  <div><strong>Email Content:</strong> {selectedApplication.emailContent}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Your Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Provide constructive feedback to help the student improve their job application process..."
                className="input-saas w-full resize-y"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowFeedbackModal(false)
                  setSelectedApplication(null)
                  setFeedback('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedback.trim()}
                className="btn-primary disabled:opacity-60"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
