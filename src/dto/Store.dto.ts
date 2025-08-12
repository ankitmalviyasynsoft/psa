export type Store = {
  id: number
  userId: number
  name: string
  slug: string
  images: any
  currency_code: string
  currency_symbol: string
  settings: any
  createdAt: string
  updatedAt: string
}

export interface ServiceDTO {
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
  createdAt: string
  updatedAt: string
}

export interface PSASettingsDTO {
  id: number
  userId: number
  storeId: number
  card_cleaning_fees: number
  enable_psa_submissions: boolean
  enable_card_cleaning: boolean
  enable_dropoff: boolean
  enable_shipping: boolean
  createdAt: string
  updatedAt: string
  services: ServiceDTO[]
}
