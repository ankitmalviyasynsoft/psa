import { ApiResponse } from '@/pages/auth/Auth.type'
import { api } from './api.config'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentStatus: builder.mutation<ApiResponse, { accessCode?: any; orderId?: any; unique_id?: any }>({
      query: (body) => ({
        url: `order/update-payment-status`,
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
    getPaymentStatusForExternal: builder.mutation<ApiResponse, { accessCode?: any; orderId?: any; unique_id?: any }>({
      query: (body) => ({
        url: `guest/orderByToken/update-payment-status-by-token`,
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
    getUpchargePaymentStatus: builder.mutation<ApiResponse, { accessCode?: any; orderId?: any; unique_id?: any }>({
      query: (body) => ({
        url: `guest/orderByToken/update-upchanrge-payment-status-by-token`,
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
  }),
})

export const { useGetPaymentStatusMutation, useGetPaymentStatusForExternalMutation, useGetUpchargePaymentStatusMutation } = extendedApi
