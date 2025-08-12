import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface OrderItem {
  uid: number
  image_link: string
  card_name: string
  declared_value: number
}

export interface OrderCustomer {
  firstName: string
  lastName: string
  email: string
  phone: string
  address_1: string
  address_2?: string
  city: string
  state: string
  zip_code: string
}

export interface PSASelectedServices {
  enable_psa_submissions: boolean
  card_cleaning_fees: number
  enable_card_cleaning: boolean
  psa_setting_service_id: number
}

export interface OrderPSAService {
  psa_selected_services: PSASelectedServices
  card_cleaning: boolean
  quantity: number
  rate: number
  total: number
}

export interface OrderTransaction {
  payment_method: string
}

export interface Order {
  userId: number | null
  orderId: number | null
  storeId: number | null
  total: number
  sub_total: number
  currency_symbol: string
  currency_code: string
  status: 'draft' | 'pending'
  discount: number
  rate: number
  quantity: number
  shipping_total: number
  orderItems: OrderItem[]
  orderCustomer: OrderCustomer
  orderPSAService: OrderPSAService
  orderTransaction: OrderTransaction
}

interface NewSubmissionState {
  order: Order
}

const initialState: NewSubmissionState = {
  order: {
    userId: null,
    orderId: null,
    storeId: null,
    total: 0,
    sub_total: 0,
    currency_symbol: '',
    currency_code: '',
    status: 'draft',
    discount: 0,
    rate: 0,
    quantity: 0,
    shipping_total: 0,
    orderItems: [],
    orderCustomer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      zip_code: '',
    },
    orderPSAService: {
      psa_selected_services: {
        enable_psa_submissions: false,
        card_cleaning_fees: 0,
        enable_card_cleaning: false,
        psa_setting_service_id: 0,
      },
      card_cleaning: false,
      quantity: 0,
      rate: 0,
      total: 0,
    },
    orderTransaction: {
      payment_method: '',
    },
  },
}

export const newSubmissionSlice = createSlice({
  name: 'newSubmission',
  initialState,
  reducers: {
    createNewSubmission: (state, action: PayloadAction<Order>) => {
      state.order = { ...action.payload }
    },
    resetNewSubmission: (state) => {
      state.order = { ...initialState.order }
    },
  },
})

export const { createNewSubmission, resetNewSubmission } = newSubmissionSlice.actions

export default newSubmissionSlice.reducer
