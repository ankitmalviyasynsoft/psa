import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { removeCookie } from '@/utils/cookie.util'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isWebsiteLoading: false,
    isLoggedIn: false,
  },
  reducers: {
    handleWebsiteLoader: (state, action: PayloadAction<boolean>) => {
      state.isWebsiteLoading = action.payload
    },
    handleLogout: () => {
      localStorage.removeItem('impersonatedToken')
      removeCookie('token')
      window.location.replace('/auth/login')
    },
  },
})

export const { handleLogout, handleWebsiteLoader } = authSlice.actions
