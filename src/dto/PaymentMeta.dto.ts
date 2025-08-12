export interface PaymentMetaDTO {
  id: number
  payment_method_id: number
  key: string
  value: string
}

export interface PaymentMethodDTO {
  id: number
  userId: number
  storeId: number
  status: boolean
  name: string
  key: string
  api_key: string
  is_dev: boolean
  payment_meta: PaymentMetaDTO[]
}

export interface PaymentMethodsResponseDTO {
  payment_methods: PaymentMethodDTO[]
}
