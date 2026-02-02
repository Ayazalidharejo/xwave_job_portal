import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  myReplies: [],
  allReplies: [],
  loading: false,
  error: null,
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setMyReplies: (state, action) => {
      state.myReplies = action.payload
      state.error = null
    },
    setAllReplies: (state, action) => {
      state.allReplies = action.payload
      state.error = null
    },
    addReply: (state, action) => {
      state.myReplies.unshift(action.payload)
    },
    updateReplyStatus: (state, action) => {
      const { id, status } = action.payload
      const r = state.allReplies.find((x) => x._id === id)
      if (r) r.status = status
      const myR = state.myReplies.find((x) => x._id === id)
      if (myR) myR.status = status
    },
    setAiLoading: (state, action) => {
      state.loading = action.payload
    },
    setAiError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setMyReplies,
  setAllReplies,
  addReply,
  updateReplyStatus,
  setAiLoading,
  setAiError,
} = aiSlice.actions
export default aiSlice.reducer
