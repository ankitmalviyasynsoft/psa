interface PaymentMetaDto {
  id: number
  payment_method_id: number
  key: string
  value: string
}

interface PaymentMethodDto {
  id: number
  userId: number
  storeId: number
  status: boolean
  name: string
  key: string
  api_key: string
  is_dev: boolean
  payment_meta: PaymentMetaDto[]
}

export interface GetPaymentMethodListResponseDto {
  statusCode: number
  message: string
  result: PaymentMethodDto[]
}
