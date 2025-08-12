import { api } from './api.config'
import { CardDTO } from '@/dto/Card.dto'
import { BasicResponse } from '@/types/basicResponse.type'
import { TPaginationApiParams } from '@/types/PaginationApiParams.type'
import { PaginationApiResponse } from '@/types/PaginationApiResponse.type'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCardList: builder.query<PaginationApiResponse<CardDTO>, TPaginationApiParams>({
      query: ({ searchVal, page, limit, game_title, expansion, rarity }) => {
        const params = new URLSearchParams({
          page: page?.toString() || '1',
          limit: limit?.toString() || '10',
        })

        if (searchVal) params.append('searchVal', searchVal)
        if (game_title) params.append('game_title', game_title)
        if (expansion) params.append('expansion', expansion)
        if (rarity) params.append('rarity', rarity)

        return {
          url: `cards/list?${params.toString()}`,
          method: 'GET',
          headers: { hideToast: 'true' },
        }
      },
    }),
    addNewCard: builder.mutation<BasicResponse, Partial<CardDTO>>({
      query: (cardData) => ({
        url: 'cards/save',
        method: 'POST',
        body: cardData,
      }),
    }),
    uploadCSVFile: builder.mutation<BasicResponse, FormData>({
      query: (formData) => ({
        url: 'cards/uploadCardCsv',
        method: 'POST',
        body: formData,
        headers: { hideSuccessToast: 'false' },
      }),
    }),
    editCard: builder.mutation<BasicResponse, { id: number; body: Partial<CardDTO> }>({
      query: ({ id, body }) => ({
        url: `cards/edit/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteCards: builder.mutation<BasicResponse, number[]>({
      query: (ids) => ({
        url: `cards/delete`,
        method: 'DELETE',
        body: { ids },
      }),
    }),

    getGameList: builder.query<string[], void>({
      query: () => `cards/getGameList`,
    }),
    getExpansionsList: builder.query<string[], void>({
      query: () => `cards/getExpansionsList`,
    }),
    getRarityList: builder.query<string[], void>({
      query: () => `cards/getRarityList`,
    }),
  }),
})

export const { useGetCardListQuery, useAddNewCardMutation, useUploadCSVFileMutation, useEditCardMutation, useDeleteCardsMutation, useGetGameListQuery, useGetExpansionsListQuery, useGetRarityListQuery } = extendedApi
