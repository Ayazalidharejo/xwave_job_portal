import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  activeModule: null,
  stats: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setActiveModule: (state, action) => {
      state.activeModule = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, setActiveModule, setStats } = dashboardSlice.actions
export default dashboardSlice.reducer
