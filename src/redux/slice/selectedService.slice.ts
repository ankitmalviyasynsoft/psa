import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectedService {
  max_declared_value: number
  cost: number
  bulk_discount: number
  id: number
  psa_settings_id: number
  name: string
  days: number
  days_label: string
  minimum_card_req: number
  quantity: number
}

const initialState: SelectedService = {
  max_declared_value: 0,
  cost: 0,
  bulk_discount: 0,
  id: 0,
  psa_settings_id: 0,
  name: '',
  days: 0,
  days_label: '',
  minimum_card_req: 0,
  quantity: 0,
}

export const selectedServiceSlice = createSlice({
  name: 'selectedService',
  initialState,
  reducers: {
    setselectedService: (state, action: PayloadAction<SelectedService>) => {
      return action.payload
    },
  },
})

export const { setselectedService } = selectedServiceSlice.actions
