import { api } from './api.config'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethodsById: builder.query<any, number>({
      query: (id) => ({ url: `/getPaymentMethods/list/${id}`, headers: { hideToast: 'true' } }),
    }),
  }),
})

export const { useGetPaymentMethodsByIdQuery } = extendedApi
