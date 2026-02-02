import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setAllReplies, setAiLoading } from '../../../store/slices/aiSlice'
import { aiApi } from '../../../services/api'

export function AIAdminReplies() {
  const dispatch = useAppDispatch()
  const allReplies = useAppSelector((state) => state.ai.allReplies)
  const loading = useAppSelector((state) => state.ai.loading)
  useEffect(() => {
    dispatch(setAiLoading(true))
    aiApi.getAll().then((res) => dispatch(setAllReplies(res.data))).finally(() => dispatch(setAiLoading(false)))
  }, [dispatch])
  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-4">AI Replies</h1>
      <div className="bg-white border border-neutral-200 rounded-saas-lg p-4 sm:p-6">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : allReplies.length === 0 ? (
          <p className="text-sm text-neutral-500">No replies.</p>
        ) : (
          <ul className="space-y-2">
            {allReplies.map((r) => (
              <li key={r._id} className="text-sm text-neutral-700 py-1 border-b border-neutral-100 last:border-0">
                {r.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
