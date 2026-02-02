import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import jobReducer from './slices/jobSlice'
import resumeReducer from './slices/resumeSlice'
import portfolioReducer from './slices/portfolioSlice'
import aiReducer from './slices/aiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    job: jobReducer,
    resume: resumeReducer,
    portfolio: portfolioReducer,
    ai: aiReducer,
  },
})
