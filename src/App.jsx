import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { PublicOnlyRoute } from './components/routes/PublicOnlyRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { RequestAdmin } from './pages/RequestAdmin'
import { Unauthorized } from './pages/Unauthorized'
import { DashboardLayout } from './pages/dashboard/DashboardLayout'
import { DashboardRedirect } from './pages/dashboard/DashboardRedirect'
import { UserDashboard } from './pages/dashboard/user/UserDashboard'
import { JobApplications } from './pages/dashboard/user/JobApplications'
import { ResumeBuilder } from './pages/dashboard/user/ResumeBuilder'
import EnhancedResumeBuilder from './pages/dashboard/user/EnhancedResumeBuilder'
import { PortfolioBuilder } from './pages/dashboard/user/PortfolioBuilder'
import AdvancedPortfolioBuilder from './pages/dashboard/user/AdvancedPortfolioBuilder'
import { AIReplies } from './pages/dashboard/user/AIReplies'
import { JobAdminDashboard } from './pages/dashboard/admin/JobAdminDashboard'
import { JobAdminApplications } from './pages/dashboard/admin/JobAdminApplications'
import { ResumeAdminDashboard } from './pages/dashboard/admin/ResumeAdminDashboard'
import { ResumeAdminList } from './pages/dashboard/admin/ResumeAdminList'
import { AIAdminDashboard } from './pages/dashboard/admin/AIAdminDashboard'
import { AIAdminReplies } from './pages/dashboard/admin/AIAdminReplies'
import { SuperAdminDashboard } from './pages/dashboard/super-admin/SuperAdminDashboard'
import { UsersAdmin } from './pages/dashboard/super-admin/UsersAdmin'
import { AdminRequests } from './pages/dashboard/super-admin/AdminRequests'
import { Activity } from './pages/dashboard/super-admin/Activity'
import { ROLES } from './constants/roles'
import { BasicDashboard } from './pages/BasicDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasicDashboard />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
        <Route path="/request-admin" element={<PublicOnlyRoute><RequestAdmin /></PublicOnlyRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          <Route path="user" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><UserDashboard /></ProtectedRoute>} />
          <Route path="user/jobs" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><JobApplications /></ProtectedRoute>} />
          <Route path="user/resume" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><ResumeBuilder /></ProtectedRoute>} />
          <Route path="user/enhanced-resume" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><EnhancedResumeBuilder /></ProtectedRoute>} />
          <Route path="user/portfolio" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><PortfolioBuilder /></ProtectedRoute>} />
          <Route path="user/advanced-portfolio" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><AdvancedPortfolioBuilder /></ProtectedRoute>} />
          <Route path="user/ai" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><AIReplies /></ProtectedRoute>} />
          <Route path="admin/job" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN_JOB, ROLES.SUPER_ADMIN]}><JobAdminDashboard /></ProtectedRoute>} />
          <Route path="admin/job/applications" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN_JOB, ROLES.SUPER_ADMIN]}><JobAdminApplications /></ProtectedRoute>} />
          <Route path="admin/resume" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN_RESUME, ROLES.SUPER_ADMIN]}><ResumeAdminDashboard /></ProtectedRoute>} />
          <Route path="admin/resume/list" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN_RESUME, ROLES.SUPER_ADMIN]}><ResumeAdminList /></ProtectedRoute>} />
          <Route path="admin/ai" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN_AI, ROLES.SUPER_ADMIN]}><AIAdminDashboard /></ProtectedRoute>} />
          <Route path="admin/ai/replies" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN_AI, ROLES.SUPER_ADMIN]}><AIAdminReplies /></ProtectedRoute>} />
          <Route path="super-admin" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="super-admin/requests" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><AdminRequests /></ProtectedRoute>} />
          <Route path="super-admin/users" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><UsersAdmin /></ProtectedRoute>} />
          <Route path="super-admin/activity" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN_JOB, ROLES.ADMIN_RESUME, ROLES.ADMIN_AI]}><Activity /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
