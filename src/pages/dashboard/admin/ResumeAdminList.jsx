import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setAllResumes, setResumeLoading } from '../../../store/slices/resumeSlice'
import { resumeApi } from '../../../services/api'

export function ResumeAdminList() {
  const dispatch = useAppDispatch()
  const allResumes = useAppSelector((state) => state.resume.allResumes)
  const loading = useAppSelector((state) => state.resume.loading)
  useEffect(() => {
    dispatch(setResumeLoading(true))
    resumeApi.getAll().then((res) => dispatch(setAllResumes(res.data))).finally(() => dispatch(setResumeLoading(false)))
  }, [dispatch])
  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Resumes</h1>
      <div className="bg-white border border-neutral-200 rounded-saas-lg p-4 sm:p-6">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : allResumes.length === 0 ? (
          <p className="text-sm text-neutral-500">No resumes.</p>
        ) : (
          <ul className="space-y-2">
            {allResumes.map((r) => (
              <li key={r._id} className="text-sm text-neutral-700 py-1 border-b border-neutral-100 last:border-0">
                {r.user?.name ?? r.userId?.name} · {r.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
