export interface CardDTO {
  id: number
  uid: string
  title: string
  game_title: string
  expansion: string
  rarity: string
  number: string
  declared_value: number
  year: number
  image_link: string | null
  abbreviation: string
  other_information: string | null
  createdAt: string
  updatedAt: string
}

export interface AddNewCardDTO {}

export interface CardApiResponse {
  cards: any
  statusCode: number
  message: string
  result: CardDTO[]
  totalItems: number
  currentPage: number
  totalPages: number
}

export interface SaveCardDTO {
  statusCode: number
  message: string
  declared_value?: number
  title: string | ''
}
