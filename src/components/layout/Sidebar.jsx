import { NavLink, useNavigate } from 'react-router-dom'
import WorkOutline from '@mui/icons-material/WorkOutline'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined'
import Assignment from '@mui/icons-material/Assignment'
import Brush from '@mui/icons-material/Brush'
import Article from '@mui/icons-material/Article'
import People from '@mui/icons-material/People'
import History from '@mui/icons-material/History'
import PendingActions from '@mui/icons-material/PendingActions'
import Logout from '@mui/icons-material/Logout'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import Close from '@mui/icons-material/Close'
import { useAppSelector, useAppDispatch, useMediaQuery } from '../../hooks'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { setSidebarOpen, toggleSidebar } from '../../store/slices/dashboardSlice'
import { logout } from '../../store/slices/authSlice'
import { ROLES } from '../../constants/roles'

const SIDEBAR_WIDTH_COLLAPSED = 64
const SIDEBAR_WIDTH_EXPANDED = 224

const userNav = [
  { to: '/dashboard/user', label: 'Dashboard', icon: DashboardOutlined },
  { to: '/dashboard/user/jobs', label: 'Job Applications', icon: WorkOutline },
  { to: '/dashboard/user/resume', label: 'Resume Builder', icon: DescriptionOutlined },
  { to: '/dashboard/user/enhanced-resume', label: 'Enhanced Resume', icon: Article },
  { to: '/dashboard/user/portfolio', label: 'Portfolio', icon: Assignment },
  { to: '/dashboard/user/advanced-portfolio', label: 'Advanced Portfolio', icon: Brush },
  { to: '/dashboard/user/ai', label: 'AI Replies', icon: SmartToyOutlined },
]

const adminJobNav = [
  { to: '/dashboard/admin/job', label: 'Dashboard', icon: DashboardOutlined },
  { to: '/dashboard/admin/job/applications', label: 'Applications', icon: WorkOutline },
]

const adminResumeNav = [
  { to: '/dashboard/admin/resume', label: 'Dashboard', icon: DashboardOutlined },
  { to: '/dashboard/admin/resume/list', label: 'Resumes', icon: DescriptionOutlined },
]

const adminAiNav = [
  { to: '/dashboard/admin/ai', label: 'Dashboard', icon: DashboardOutlined },
  { to: '/dashboard/admin/ai/replies', label: 'AI Replies', icon: SmartToyOutlined },
]

const superAdminNav = [
  { to: '/dashboard/super-admin', label: 'Dashboard', icon: DashboardOutlined },
  { to: '/dashboard/super-admin/requests', label: 'Admin Requests', icon: PendingActions },
  { to: '/dashboard/super-admin/users', label: 'Users & Admins', icon: People },
  { to: '/dashboard/super-admin/activity', label: 'Activity Logs', icon: History },
]

function getNavForRole(role) {
  switch (role) {
    case ROLES.USER: return userNav
    case ROLES.ADMIN_JOB: return adminJobNav
    case ROLES.ADMIN_RESUME: return adminResumeNav
    case ROLES.ADMIN_AI: return adminAiNav
    case ROLES.SUPER_ADMIN: return superAdminNav
    default: return userNav
  }
}

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 w-full py-2 px-3 rounded-xl text-sm font-medium border-l-4 min-h-[44px] transition-all duration-200 ${
    isActive
      ? 'border-white bg-white/20 text-white shadow-lg shadow-indigo-900/20'
      : 'border-transparent text-indigo-200/90 hover:bg-white/10 hover:text-white'
  }`

export function Sidebar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const open = useAppSelector((state) => state.dashboard.sidebarOpen)
  const role = useAppSelector((state) => state.auth.role)
  const user = useAppSelector((state) => state.auth.user)
  const navItems = getNavForRole(role)
  const isExpanded = open
  const width = isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED

  const onClose = () => dispatch(setSidebarOpen(false))

  const handleLogout = () => {
    dispatch(logout())
    onClose()
    navigate('/login')
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between h-14 px-3 border-b border-white/10 shrink-0">
        {isExpanded && <span className="text-sm font-bold text-white tracking-tight">Marge</span>}
        {isDesktop ? (
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-xl text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            data-tooltip={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close menu"
          >
            <Close className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={navLinkClass}
                  onClick={() => {}}
                >
                  <Icon className="w-5 h-5 shrink-0 text-current" />
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
        <div className="border-t border-white/10 mt-2 pt-2 space-y-1">
          {isExpanded && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
              {role && (user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0" />
              ) : (
                <AccountCircle className="w-8 h-8 text-indigo-200 shrink-0" />
              ))}
              <span className="text-xs font-medium text-white truncate">{user?.name}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-2 px-3 rounded-xl text-sm font-medium text-red-300 border-l-4 border-transparent hover:bg-red-500/20 hover:text-red-200 min-h-[44px] transition-all duration-200"
          >
            <Logout className="w-5 h-5 shrink-0" />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop: fixed sidebar with themed gradient */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-30 shrink-0 shadow-xl shadow-indigo-900/20"
        style={{
          width: `${width}px`,
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {sidebarContent}
      </aside>
      {/* Mobile: overlay + panel when open */}
      <div className="md:hidden">
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <aside
          className={`fixed left-0 top-0 h-screen w-56 max-w-[85vw] z-50 flex flex-col md:hidden shadow-2xl ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            transition: 'transform 0.25s ease',
            background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  )
}

export const SIDEBAR_WIDTH = SIDEBAR_WIDTH_EXPANDED
export const SIDEBAR_WIDTH_COLLAPSED_PX = SIDEBAR_WIDTH_COLLAPSED
export function getSidebarWidthPx(open) {
  return open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED
}
