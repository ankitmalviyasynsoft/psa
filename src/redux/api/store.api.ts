import { TPaginationApiParams } from '@/types/PaginationApiParams.type'
import { api } from './api.config'
import { StoreApiResponse } from '@/types/StoreApiResponse.type'
import { ApiResponse } from '@/types'
import { Store } from '../slice/selectedStore'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStoreList: builder.query<StoreApiResponse, TPaginationApiParams>({
      query: (params) => ({ url: '/store/list', params, headers: { hideToast: 'true' } }),
    }),
    getStoreDetailsById: builder.query<{ result: Store }, string | number>({
      query: (idOrslug) => ({ url: `/store/getStoreDetails/${idOrslug}`, headers: { hideToast: 'true' } }),
    }),
  }),
})

export const { useGetStoreListQuery, useLazyGetStoreDetailsByIdQuery } = extendedApi
