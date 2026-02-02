import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  myApplications: [],
  allApplications: [],
  loading: false,
  error: null,
}

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setMyApplications: (state, action) => {
      state.myApplications = action.payload
      state.error = null
    },
    setAllApplications: (state, action) => {
      state.allApplications = action.payload
      state.error = null
    },
    addApplication: (state, action) => {
      state.myApplications.unshift(action.payload)
    },
    updateApplicationFeedback: (state, action) => {
      const { id, adminFeedback } = action.payload
      const app = state.allApplications.find((a) => a._id === id)
      if (app) {
        app.adminFeedback = adminFeedback
      }
      const myApp = state.myApplications.find((a) => a._id === id)
      if (myApp) {
        myApp.adminFeedback = adminFeedback
      }
    },
    setJobLoading: (state, action) => {
      state.loading = action.payload
    },
    setJobError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setMyApplications,
  setAllApplications,
  addApplication,
  updateApplicationFeedback,
  setJobLoading,
  setJobError,
} = jobSlice.actions
export default jobSlice.reducer
