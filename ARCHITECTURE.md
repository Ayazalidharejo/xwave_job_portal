# Marge Platform – Architecture Overview

## 1. Frontend Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx      # Role-based nav (user / admin_job / admin_resume / admin_ai / super_admin)
│   │   └── Topbar.jsx       # App bar, user menu, logout
│   └── routes/
│       ├── ProtectedRoute.jsx   # Requires auth; optional allowedRoles
│       └── PublicOnlyRoute.jsx # Redirects authenticated users to dashboard
├── constants/
│   └── roles.js             # ROLES, ROLE_LABELS, DASHBOARD_PATHS
├── hooks/
│   ├── index.js
│   ├── useAppDispatch.js
│   ├── useAppSelector.js
│   └── useVoiceCommand.js   # Web Speech API → command mapping (align, heading, image size)
├── pages/
│   ├── Login.jsx            # Single login for all roles
│   ├── Register.jsx         # Self-register (user only)
│   ├── Unauthorized.jsx
│   └── dashboard/
│       ├── DashboardLayout.jsx   # Sidebar + Topbar + Outlet
│       ├── DashboardRedirect.jsx # Redirects /dashboard to role path
│       ├── user/                  # User role
│       │   ├── UserDashboard.jsx
│       │   ├── JobApplications.jsx
│       │   ├── ResumeBuilder.jsx
│       │   ├── PortfolioBuilder.jsx
│       │   └── AIReplies.jsx
│       ├── admin/                 # admin_job, admin_resume, admin_ai
│       │   ├── JobAdminDashboard.jsx, JobAdminApplications.jsx
│       │   ├── ResumeAdminDashboard.jsx, ResumeAdminList.jsx
│       │   └── AIAdminDashboard.jsx, AIAdminReplies.jsx
│       └── super-admin/
│           ├── SuperAdminDashboard.jsx
│           ├── UsersAdmin.jsx      # Create admin (super_admin only)
│           └── ActivityLogs.jsx
├── services/
│   └── api.js                # Axios instance + auth/job/resume/portfolio/ai/user/activity APIs
├── store/
│   ├── index.js              # RTK store (auth, dashboard, job, resume, portfolio, ai)
│   └── slices/
│       ├── authSlice.js
│       ├── dashboardSlice.js
│       ├── jobSlice.js
│       ├── resumeSlice.js
│       ├── portfolioSlice.js
│       └── aiSlice.js
└── utils/
    ├── constants.js          # JOB_PLATFORMS, JOB_STATUS
    └── roleRedirect.js      # getDashboardPathForRole(role)
```

## 2. Backend Folder Structure

```
backend/
├── config/
│   └── db.js                 # Mongoose connect
├── middleware/
│   ├── auth.js               # protect: JWT verify, req.user
│   ├── roleMiddleware.js     # requireRole(...allowedRoles)
│   └── activityLog.js        # logActivity(req, action, details)
├── models/
│   ├── User.js               # name, email, password, role, isActive
│   ├── JobApplication.js     # userId, platform, messageContent, status, adminFeedback
│   ├── Resume.js, ResumeTemplate.js
│   ├── Portfolio.js
│   ├── AIReply.js
│   └── ActivityLog.js
├── controllers/
│   ├── authController.js     # register, login, getMe
│   ├── userController.js     # createAdmin, listUsers (super_admin)
│   ├── jobController.js      # create, getMy, getAll, addFeedback
│   ├── resumeController.js   # upsert, getMy, list, review, getTemplates
│   ├── portfolioController.js
│   ├── aiController.js
│   └── activityController.js # getLogs (super_admin)
├── routes/
│   ├── authRoutes.js        # POST /register, /login; GET /me (protect)
│   ├── userRoutes.js        # POST /admin, GET / (protect + requireRole super_admin)
│   ├── jobRoutes.js
│   ├── resumeRoutes.js
│   ├── portfolioRoutes.js
│   ├── aiRoutes.js
│   └── activityRoutes.js
└── index.js                 # Express, CORS, mount routes, connectDB
```

## 3. Auth & Role-Based Redirect

- **Single login** at `/login`. Backend returns `{ user, role, token }`.
- **Frontend**: On login success, `setCredentials({ user, token })`; `getDashboardPathForRole(role)` returns:
  - `user` → `/dashboard/user`
  - `admin_job` → `/dashboard/admin/job`
  - `admin_resume` → `/dashboard/admin/resume`
  - `admin_ai` → `/dashboard/admin/ai`
  - `super_admin` → `/dashboard/super-admin`
- **PublicOnlyRoute**: If authenticated, redirect to `getDashboardPathForRole(role)`.
- **ProtectedRoute**: If not authenticated → `/login`; if `allowedRoles` and role not in list → `/unauthorized`.
- **Dashboard index** (`/dashboard`) → `DashboardRedirect` → Navigate to role path.

## 4. Redux Store Setup

- **authSlice**: user, token, role, isAuthenticated, loading, error. Persist token/user in localStorage; clear on logout.
- **dashboardSlice**: sidebarOpen, activeModule, stats.
- **jobSlice**: myApplications, allApplications, loading, error; actions for set/add/update feedback.
- **resumeSlice**: myResume, templates, allResumes, loading, error.
- **portfolioSlice**: myPortfolio, loading, error.
- **aiSlice**: myReplies, allReplies, loading, error; addReply, updateReplyStatus.

## 5. Sample API Endpoints

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | /api/auth/register | - | - | Self-register (role=user) |
| POST | /api/auth/login | - | - | Login; returns user, role, token |
| GET | /api/auth/me | JWT | - | Current user |
| POST | /api/users/admin | JWT | super_admin | Create admin |
| GET | /api/users | JWT | super_admin | List users |
| POST | /api/jobs | JWT | user | Create job application |
| GET | /api/jobs/my | JWT | user | My applications |
| GET | /api/jobs/all | JWT | admin_job, super_admin | All applications (query: platform, status) |
| PATCH | /api/jobs/:id/feedback | JWT | admin_job, super_admin | Add feedback |
| GET/PUT | /api/resumes/my, /api/resumes/templates | JWT | user | My resume, templates |
| GET | /api/resumes/all | JWT | admin_resume, super_admin | List resumes |
| PATCH | /api/resumes/:id/review | JWT | admin_resume, super_admin | Approve/reject |
| GET/PUT | /api/portfolios/my | JWT | user | My portfolio |
| GET | /api/portfolios/public/:slug | - | - | Public portfolio |
| POST | /api/ai | JWT | user | Create AI reply |
| GET | /api/ai/my, /api/ai/all | JWT | user / admin_ai | My replies / all (admin) |
| PATCH | /api/ai/:id/review | JWT | admin_ai, super_admin | Approve/reject/posted |
| GET | /api/activity | JWT | super_admin | Activity logs (paginated) |

## 6. Key React Components

- **Layout**: `DashboardLayout` = Topbar + Sidebar (role-based nav) + `<Outlet />` for nested routes.
- **Auth**: `Login`, `Register` use react-hook-form + zod; on success dispatch `setCredentials` and navigate to role dashboard.
- **ProtectedRoute**: Checks `isAuthenticated` and optional `allowedRoles`; redirects to login or unauthorized.
- **PublicOnlyRoute**: Redirects logged-in users to their dashboard.
- **Voice**: `useVoiceCommand(onCommand)` uses Web Speech API; maps phrases like "align text left", "make heading one", "image width 500 pixels" to `{ type, payload }` for Resume/Portfolio builder.

## 7. UI/UX

- Same theme for all users (Tailwind + MUI). Only features and access differ by role.
- Sidebar shows different links per role; Topbar shows user name and role.
- Responsive: sidebar collapses to drawer on small screens; Topbar toggle opens/closes sidebar.
- Minimal, professional SaaS layout with smooth transitions.
