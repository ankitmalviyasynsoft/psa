export interface CurrencyApiResponse {
  statusCode: number
  message: string
  result: CurrencyDTO[]
}
export interface CurrencyDTO {
  id: number
  currency_name: string
  currency_code: string
  symbol: string
  is_active: boolean
}
