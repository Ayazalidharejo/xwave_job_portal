import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/slices/authSlice'

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (err) => Promise.reject(err)
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout())
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
}

export const jobApi = {
  create: (data) => api.post('/jobs', data),
  getMy: (params) => api.get('/jobs/my', { params }),
  getAll: (params) => api.get('/jobs/all', { params }),
  addFeedback: (id, feedbackData) => api.patch(`/jobs/${id}/feedback`, feedbackData),
  addStudentReply: (id, replyText) => api.patch(`/jobs/${id}/student-reply`, { studentReply: replyText }),
}

export const resumeApi = {
  getTemplates: () => api.get('/resumes/templates'),
  getMy: () => api.get('/resumes/my'),
  upsertMy: (data) => api.put('/resumes/my', data),
  getAll: (params) => api.get('/resumes/all', { params }),
  review: (id, data) => api.patch(`/resumes/${id}/review`, data),
}

export const portfolioApi = {
  getMy: () => api.get('/portfolios/my'),
  upsertMy: (data) => api.put('/portfolios/my', data),
  getBySlug: (slug) => api.get(`/portfolios/public/${slug}`),
  /** Upload image to Cloudinary via backend; returns { url } */
  uploadImage: (file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post('/portfolios/upload-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const aiApi = {
  create: (data) => api.post('/ai', data),
  getMy: () => api.get('/ai/my'),
  getAll: (params) => api.get('/ai/all', { params }),
  review: (id, status) => api.patch(`/ai/${id}/review`, { status }),
}

export const userApi = {
  createAdmin: (data) => api.post('/users/admin', data),
  list: (params) => api.get('/users', { params }),
}

export const activityApi = {
  getLogs: (params) => api.get('/activity', { params }),
}

export const adminRequestApi = {
  create: (data) => api.post('/admin-requests', data),
  list: (params) => api.get('/admin-requests', { params }),
  approve: (id) => api.patch(`/admin-requests/${id}/approve`),
  reject: (id) => api.patch(`/admin-requests/${id}/reject`),
}

export const statsApi = {
  get: () => api.get('/stats'),
}
