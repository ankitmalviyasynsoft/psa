export type ApiResponse<T> = {
  result: T
  httpCode: number
  message: string
}
