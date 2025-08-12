import { api } from './api.config'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDetailsByToken: builder.query<any, string>({
      query: (token) => ({
        url: '/guest/orderByToken/order',
        method: 'POST',
        body: { token },
        headers: { hideToast: 'true' },
      }),
    }),
    getUpchargeDetails: builder.query<any, string>({
      query: (token) => ({
        url: '/guest/orderByToken/getUpchargeDetails',
        method: 'POST',
        body: { token },
        headers: { hideToast: 'true' },
      }),
    }),
  }),
})

export const { useLazyGetOrderDetailsByTokenQuery, useLazyGetUpchargeDetailsQuery } = extendedApi
