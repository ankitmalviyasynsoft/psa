export type TPaginationApiParams = {
  id?: string
  page: number
  limit: number
  sortOrder?: 'desc' | 'asc'
  sortBy?: string
  searchVal?: string
  payment_status?: string
  payment_method?: string
  selectedOrdersId?: string
  onlySubmissionsAvail?: boolean
  game_title?: string
  expansion?: string
  rarity?: string
  submissionNumber?: number
}
