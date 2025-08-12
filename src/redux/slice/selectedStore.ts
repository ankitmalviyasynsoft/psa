import { createSlice } from '@reduxjs/toolkit'

interface ServiceDTO {
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

interface PSASettingsDTO {
  card_cleaning_fees: number
  id: number
  userId: number
  storeId: number
  enable_psa_submissions: boolean
  enable_card_cleaning: boolean
  enable_dropoff: boolean
  enable_shipping: boolean
  createdAt: string
  updatedAt: string
  services: ServiceDTO[]
}

interface StoreShippingDTO {
  cost: number
  id: number
  userId: number
  storeId: number
  enable_shipping: boolean
  shipping_key: string
  shipping_label: string
  api_key: string
  dev_mode: boolean
  settings: any
}

export interface Store {
  id: number
  userId: number
  name: string
  images: null | any
  slug: string
  currency_symbol: string
  currency_code: string
  settings: null | any
  createdAt: string
  updatedAt: string
  psaSettings: PSASettingsDTO
  storeShipping: StoreShippingDTO[]
}

const initialState: Store = {
  id: 0,
  userId: 0,
  name: '',
  images: null,
  settings: null,
  slug: '',
  createdAt: '',
  updatedAt: '',
  currency_symbol: '$',
  currency_code: 'USD',
  psaSettings: {
    card_cleaning_fees: 0,
    id: 0,
    userId: 0,
    storeId: 0,
    enable_psa_submissions: false,
    enable_card_cleaning: false,
    createdAt: '',
    updatedAt: '',
    enable_dropoff: false,
    enable_shipping: false,
    services: [],
  },
  storeShipping: [],
}

export const storeData = createSlice({
  name: 'selectedStore',
  initialState,
  reducers: {
    setStoreData: (state, action) => {
      return action.payload
    },
  },
})

export const { setStoreData } = storeData.actions
