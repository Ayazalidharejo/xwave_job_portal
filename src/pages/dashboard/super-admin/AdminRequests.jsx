import { useEffect, useState } from 'react'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'
import { adminRequestApi } from '../../../services/api'
import { ROLE_LABELS } from '../../../constants/roles'

export function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [tempPassword, setTempPassword] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminRequestApi.list(status ? { status } : {})
      setRequests(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status])

  const handleApprove = async (id) => {
    setTempPassword(null)
    setError('')
    try {
      const { data } = await adminRequestApi.approve(id)
      setTempPassword(data)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Approve failed')
    }
  }

  const handleReject = async (id) => {
    setError('')
    try {
      await adminRequestApi.reject(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Reject failed')
    }
  }

  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Admin requests (approval)</h1>
      <p className="text-sm text-neutral-500 mb-4">
        When someone requests admin access, it appears here. Approve to create their account; reject to deny.
      </p>
      {tempPassword && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-saas flex items-start justify-between gap-2">
          <span>
            Admin created. Email: {tempPassword.user?.email}. Temporary password: <strong>{tempPassword.tempPassword}</strong> — share with the new admin (they should change it after login).
          </span>
          <button type="button" onClick={() => setTempPassword(null)} className="text-green-600 hover:opacity-80 shrink-0">×</button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-saas" role="alert">{error}</div>
      )}
      <div className="mb-4">
        <label htmlFor="req-status" className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
        <select
          id="req-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-saas w-full max-w-[140px]"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="bg-white border border-neutral-200 rounded-saas-lg overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-3 px-4 font-medium text-neutral-700">Name</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Email</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Role</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Reason</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Status</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-4 px-4 text-neutral-500">Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={6} className="py-4 px-4 text-neutral-500">No requests.</td></tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id} className="border-b border-neutral-100">
                  <td className="py-3 px-4">{r.name}</td>
                  <td className="py-3 px-4">{r.email}</td>
                  <td className="py-3 px-4">{ROLE_LABELS[r.requestedRole]}</td>
                  <td className="py-3 px-4 max-w-[120px] truncate">{r.reason || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${
                      r.status === 'approved' ? 'bg-green-50 border-green-200 text-green-700' :
                      r.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                      'bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.status === 'pending' && (
                      <span className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleApprove(r._id)} className="btn-tertiary gap-1 text-green-600 hover:bg-green-50 text-sm py-1.5">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button type="button" onClick={() => handleReject(r._id)} className="btn-tertiary gap-1 text-red-600 hover:bg-red-50 text-sm py-1.5">
                          <Cancel className="w-4 h-4" /> Reject
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
