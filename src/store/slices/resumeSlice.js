import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  myResume: null,
  templates: [],
  allResumes: [],
  loading: false,
  error: null,
}

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setMyResume: (state, action) => {
      state.myResume = action.payload
      state.error = null
    },
    setTemplates: (state, action) => {
      state.templates = action.payload
    },
    setAllResumes: (state, action) => {
      state.allResumes = action.payload
      state.error = null
    },
    setResumeLoading: (state, action) => {
      state.loading = action.payload
    },
    setResumeError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setMyResume,
  setTemplates,
  setAllResumes,
  setResumeLoading,
  setResumeError,
} = resumeSlice.actions
export default resumeSlice.reducer
