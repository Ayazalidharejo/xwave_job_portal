import { useState } from 'react'
import Reply from '@mui/icons-material/Reply'
import Send from '@mui/icons-material/Send'

export function StudentReply({ application, onReplySubmit }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return

    setSubmitting(true)
    try {
      await onReplySubmit(application._id, reply.trim())
      setReply('')
      setShowReplyForm(false)
    } catch (error) {
      console.error('Failed to submit reply:', error)
      alert('Failed to submit reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-3">
      {application.adminFeedback && !showReplyForm && (
        <button
          onClick={() => setShowReplyForm(true)}
          className="btn-primary text-xs gap-1"
        >
          <Reply className="w-3 h-3" />
          Reply to Feedback
        </button>
      )}

      {showReplyForm && (
        <form onSubmit={handleSubmit} className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="mb-2">
            <label className="block text-xs font-medium text-blue-900 mb-1">
              Reply to {application.adminName || 'Admin'}'s Feedback:
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              placeholder="Type your reply here..."
              className="input-saas w-full resize-y text-sm"
              disabled={submitting}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!reply.trim() || submitting}
              className="btn-primary text-xs gap-1 disabled:opacity-60"
            >
              <Send className="w-3 h-3" />
              {submitting ? 'Sending...' : 'Send Reply'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReplyForm(false)
                setReply('')
              }}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
