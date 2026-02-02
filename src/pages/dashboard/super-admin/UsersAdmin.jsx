import { useEffect, useState } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { userApi } from '../../../services/api'

export function UsersAdmin() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    userApi.list().then(({ data }) => setUsers(data)).catch(console.error)
  }, [])
  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Users and Admins</h1>
      <div className="bg-white border border-neutral-200 rounded-saas-lg overflow-hidden">
        {users.length === 0 ? (
          <p className="p-4 sm:p-6 text-sm text-neutral-500">No users.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {users.map((u) => (
              <li key={u._id} className="flex items-center gap-3 p-4 sm:p-4 text-sm text-neutral-700">
                {u.profileImage ? (
                  <img src={u.profileImage} alt="" className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <AccountCircle className="w-6 h-6 text-neutral-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-neutral-900">{u.name}</span>
                  <span className="text-neutral-500"> · {u.role}</span>
                  {u.email && <span className="block text-xs text-neutral-500 truncate">{u.email}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
