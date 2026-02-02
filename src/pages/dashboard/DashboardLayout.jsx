import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppSelector, useAppDispatch, useMediaQuery } from '../../hooks'
import { setSidebarOpen } from '../../store/slices/dashboardSlice'
import { Sidebar } from '../../components/layout/Sidebar'
import { Topbar } from '../../components/layout/Topbar'
import { getSidebarWidthPx } from '../../components/layout/Sidebar'

export function DashboardLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => state.dashboard.sidebarOpen)
  const sidebarWidthPx = getSidebarWidthPx(sidebarOpen)

  useEffect(() => {
    if (!isDesktop) dispatch(setSidebarOpen(false))
  }, [isDesktop, dispatch])

  const mainStyle = isDesktop
    ? { marginLeft: sidebarWidthPx }
    : { marginLeft: 0 }

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-dashboard flex">
      <Topbar />
      <Sidebar />
      <main
        className="flex-1 min-w-0 w-full pt-14 min-h-dvh overflow-x-hidden box-border px-4 sm:px-6 md:px-8 py-6"
        style={mainStyle}
      >
        <div className="max-w-content mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
