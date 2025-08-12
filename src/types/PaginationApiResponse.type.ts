export type PaginationApiResponse<List> = {
  result: List[]
  totalItems: number
  totalPages: number
}
