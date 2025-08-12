export interface Store {
  id: number
  userId: number
  name: string
  images: string | null
  settings: any
  createdAt: string
  updatedAt: string
  psaSettings: PSASettings | null
  storeShipping: StoreShipping[]
}

interface PSASettings {
  card_cleaning_fees: number
  id: number
  userId: number
  storeId: number
  enable_psa_submissions: boolean
  enable_card_cleaning: boolean
  createdAt: string
  updatedAt: string
  services: Service[]
}

interface Service {
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

interface StoreShipping {
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

export interface StoreApiResponse {
  statusCode: number
  message: string
  result: Store[]
  totalItems: number
  currentPage: number
  totalPages: number
}
