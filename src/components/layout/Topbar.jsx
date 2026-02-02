import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Logout from '@mui/icons-material/Logout'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { useAppSelector, useAppDispatch, useMediaQuery } from '../../hooks'
import { logout, setCredentials } from '../../store/slices/authSlice'
import { setSidebarOpen } from '../../store/slices/dashboardSlice'
import { ROLE_LABELS } from '../../constants/roles'
import { getSidebarWidthPx } from './Sidebar'
import { authApi, portfolioApi } from '../../services/api'

export function Topbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { user, role } = useAppSelector((state) => state.auth)
  const sidebarOpen = useAppSelector((state) => state.dashboard.sidebarOpen)
  const [menuOpen, setMenuOpen] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const menuRef = useRef(null)
  const profileInputRef = useRef(null)

  const sidebarWidthPx = getSidebarWidthPx(sidebarOpen)
  const headerStyle = isDesktop
    ? { marginLeft: sidebarWidthPx, width: `calc(100% - ${sidebarWidthPx}px)` }
    : { marginLeft: 0, width: '100%' }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    dispatch(logout())
    setMenuOpen(false)
    navigate('/login')
  }

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setUploadingPhoto(true)
    setMenuOpen(false)
    try {
      const { data } = await portfolioApi.uploadImage(file)
      const url = data?.url
      if (url) {
        const { data: updated } = await authApi.updateProfile({ profileImage: url })
        dispatch(updateUser({ profileImage: updated.profileImage }))
      }
    } catch (err) {
      console.error('Profile photo upload failed', err)
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-20 flex items-center px-4 md:px-6 shrink-0 shadow-lg"
      style={{
        ...headerStyle,
        background: 'linear-gradient(90deg, #312e81 0%, #4338ca 50%, #4f46e5 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => dispatch(setSidebarOpen(true))}
          className="md:hidden p-2 -ml-2 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white truncate">Marge</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:block text-sm text-indigo-200 truncate max-w-[140px]">
          {user?.name} · {ROLE_LABELS[role] || role}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Logout"
        >
          <Logout className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-xl text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 overflow-hidden"
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/20" />
            ) : (
              <AccountCircle className="w-8 h-8" />
            )}
          </button>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleProfilePhotoChange}
          />
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 py-1 bg-white border border-indigo-100 rounded-xl shadow-xl z-50">
              <div className="px-3 py-2 text-xs text-zinc-500 border-b border-zinc-100 truncate">
                {user?.email}
              </div>
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-700 hover:bg-indigo-50 text-left transition-colors disabled:opacity-60"
              >
                <PhotoCamera className="w-4 h-4 shrink-0" />
                {uploadingPhoto ? 'Uploading…' : 'Change profile photo'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-700 hover:bg-indigo-50 text-left transition-colors"
              >
                <Logout className="w-4 h-4 shrink-0" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
