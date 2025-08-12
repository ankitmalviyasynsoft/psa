export interface OrderItemDTO {
  id: number
  orderId: number
  userId: number
  uid: number | null
  card_name: string
  declared_value: number
  grade: string | null
  cert_number: number
  upcharge_amount: number | null
  upcharge_status: 'unpaid' | 'paid' | null
  status: 'pending' | 'buy' | 'sell' | 'sold'
  bought_by_user: number
  image_link: string
  other_details?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface OrderCustomerDTO {
  id: number
  orderId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address_1: string
  address_2: string
  city: string
  state: string
  zip_code: string
  createdAt: string
  updatedAt: string
}

export interface OrderPSAServiceDTO {
  id: number
  orderId: number
  psa_selected_services?: any
  card_cleaning?: boolean
  quantity?: number | null
  rate?: number | null
  total?: number | null
  createdAt: string
  updatedAt: string
}

export interface OrderStatus {
  id: number
  orderId?: number | null
  status?: string | null
  key?: string | null
  date?: string | null
  settings?: any
  createdAt?: string | null
  updatedAt?: string | null
}

export interface OrderTransaction {
  id: number
  orderId?: number | null
  payment_status?: string | null
  payment_method?: string | null
  total_amount?: number | null
  session_id?: string | null
  redirect_url?: string | null
  settings?: any
  unique_id?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface OrderDTO {
  id: number
  uuid: string
  userId: number
  storeId: number
  status: string
  payment_status: string
  submission_number: number
  submission_date: Date
  received_date: Date
  t_submission_number: string
  submission_status: 'draft' | 'published'
  tracking_number: string
  shipping_carrier: string
  sync_psa: boolean
  quantity: number
  discount: number
  due_amount: number
  additional_amount: number
  rate: number
  sub_total: number
  shipping_total: number
  total: number
  currency_code: string
  currency_symbol: string
  emailStatus: string
  createdAt: Date
  updatedAt: Date
}
