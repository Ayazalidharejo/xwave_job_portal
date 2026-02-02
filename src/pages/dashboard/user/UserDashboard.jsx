import { Link } from 'react-router-dom'
import WorkOutline from '@mui/icons-material/WorkOutline'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import Assignment from '@mui/icons-material/Assignment'
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined'
import { ROLE_LABELS } from '../../../constants/roles'
import { useAppSelector } from '../../../hooks'

const tiles = [
  { to: '/dashboard/user/jobs', label: 'Job Applications', icon: WorkOutline },
  { to: '/dashboard/user/resume', label: 'Resume Builder', icon: DescriptionOutlined },
  { to: '/dashboard/user/portfolio', label: 'Portfolio Builder', icon: Assignment },
  { to: '/dashboard/user/ai', label: 'AI LinkedIn Replies', icon: SmartToyOutlined },
]

export function UserDashboard() {
  const { user, role } = useAppSelector((state) => state.auth)

  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-1">Welcome, {user?.name}</h1>
      <p className="text-sm text-zinc-500 mb-8">
        {ROLE_LABELS[role] || role} · Choose a module below
      </p>

      <h2 className="text-lg font-medium text-zinc-800 mb-4">Quick access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile, i) => {
          const Icon = tile.icon
          const gradients = [
            'from-indigo-500 to-indigo-600 text-white',
            'from-violet-500 to-violet-600 text-white',
            'from-blue-500 to-blue-600 text-white',
            'from-indigo-600 to-violet-600 text-white',
          ]
          const iconBg = gradients[i % gradients.length]
          return (
            <Link
              key={tile.to}
              to={tile.to}
              className="card-advanced block p-5 text-zinc-900 no-underline group"
            >
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${iconBg} shadow-md shrink-0 transition-transform duration-200 group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold">{tile.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
