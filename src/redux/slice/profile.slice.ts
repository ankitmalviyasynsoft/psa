import { Store } from '@/dto/Store.dto'
import { UserProfile } from '@/dto/UserProfile.dto'
import { createSlice } from '@reduxjs/toolkit'

export interface ProfileState {
  isLoggedIn: boolean
  role: string
  profile: UserProfile
  store: Store
  currency_code?: string
  currency_symbol?: string
}

const initialState: ProfileState = {
  isLoggedIn: false,
  role: '',
  profile: {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: 0,
    roleName: 'admin',
    userDetails: {
      id: 0,
      userId: 0,
      company_name: '',
      ABN_number: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      zip_code: '',
      shipping_address_1: '',
      shipping_address_2: '',
      shipping_city: '',
      shipping_state: '',
      shipping_zip_code: '',
      enable_shipping_address: false,
      createdAt: '',
      updatedAt: '',
    },
  },
  store: {
    id: 0,
    userId: 0,
    name: '',
    slug: '',
    images: null,
    currency_code: '',
    currency_symbol: '',
    settings: {},
    createdAt: '',
    updatedAt: '',
  },
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
      state.isLoggedIn = true
      state.role = action.payload.roleName
    },
  },
})

export const { setProfile } = profileSlice.actions

export default profileSlice.reducer
