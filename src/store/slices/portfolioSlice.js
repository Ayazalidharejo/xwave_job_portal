import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  myPortfolio: null,
  loading: false,
  error: null,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setMyPortfolio: (state, action) => {
      state.myPortfolio = action.payload
      state.error = null
    },
    setPortfolioLoading: (state, action) => {
      state.loading = action.payload
    },
    setPortfolioError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setMyPortfolio, setPortfolioLoading, setPortfolioError } = portfolioSlice.actions
export default portfolioSlice.reducer
