import { CardDTO } from '@/dto/Card.dto'

export interface CardApiResponse {
  cards: any
  statusCode: number
  message: string
  result: CardDTO[]
  totalItems: number
  currentPage: number
  totalPages: number
}
