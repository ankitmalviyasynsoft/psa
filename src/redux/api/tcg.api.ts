import { createApi } from '@reduxjs/toolkit/query/react'
import { externalBaseQuery } from './tcgApiBaseQuery'

interface Game {
  name: string
  categoryId: number
}

interface Expansion {
  groupId: number
  abbreviation: string
  categoryId: number
  name: string
}

interface Card {
  id: number
  name: string
}

export const tcgApi = createApi({
  reducerPath: 'tcgApi',
  baseQuery: externalBaseQuery,
  endpoints: (builder) => ({
    getGameListFromTCG: builder.query<{ games: Game[]; pagination: { hasNextPage: boolean } }, number | void>({
      query: (page = 1) => `/games?page=${page}`,
      transformResponse: (res: { data: { games: Game[]; pagination: { hasNextPage: boolean } } }) => res.data,
    }),

    getExpansionsByCategoryId: builder.query<{ expansions: Expansion[]; pagination: { hasNextPage: boolean } }, { categoryId: number; page: number }>({
      query: ({ categoryId, page }) => `/expansions/${categoryId}?page=${page}`,
      transformResponse: (res: { data: { expansions: Expansion[]; pagination: { hasNextPage: boolean } } }) => res.data,
    }),

    getCardsByGroupId: builder.query<Card[], number>({
      query: (groupId) => `/cards/${groupId}`,
      transformResponse: (res: { data: { cards: Card[] } }) => res.data.cards,
    }),
  }),
})

export const { useGetGameListFromTCGQuery, useLazyGetExpansionsByCategoryIdQuery, useLazyGetCardsByGroupIdQuery } = tcgApi
