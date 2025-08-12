import { CurrencyApiResponse } from '@/types/CurrencyApiResponse.type'
import { api } from './api.config'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencyList: builder.query<CurrencyApiResponse, void>({
      query: () => ({ url: 'admin/currency/list', headers: { hideToast: 'true' } }),
    }),
  }),
})

export const { useGetCurrencyListQuery } = extendedApi
