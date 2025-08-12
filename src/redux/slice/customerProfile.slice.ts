import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ProfileState {
  selectedCustomer: null
  orderAsRetailor: boolean
}

const initialState: ProfileState = {
  selectedCustomer: null,
  orderAsRetailor: false,
}

export const customerProfileSlice = createSlice({
  name: 'customerProfile',
  initialState,
  reducers: {
    setOrderAsRetailor: (state, action: PayloadAction<boolean>) => {
      state.orderAsRetailor = action.payload
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload
    },
    resetCustomerProfile: () => initialState,
  },
})

export const { setOrderAsRetailor, setSelectedCustomer, resetCustomerProfile } = customerProfileSlice.actions

export default customerProfileSlice.reducer
