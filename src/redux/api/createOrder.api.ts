import { ApiResponse } from '@/pages/auth/Auth.type'
import { api } from './api.config'
import { createNewSubmission } from '../slice/newSubmission.slice'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse, {}>({
      query: (body) => ({
        url: '/order/createOrder',
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
    createDraftOrder: builder.mutation<{ orderId: number }, {}>({
      query: (body) => ({
        url: 'order/create-draft-order',
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
    updateDraftOrder: builder.mutation<ApiResponse, { orderId: number; payload: any }>({
      query: ({ orderId, payload }) => ({
        url: `order/update-draft-order/${orderId}`,
        method: 'PUT',
        body: payload,
        headers: { hideToast: 'false' },
      }),
    }),
    getOrderDetailsById: builder.query<any, number>({
      query: (orderId) => ({
        url: `order/${orderId}`,
        headers: { hideToast: 'true' },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data?.result) {
          const result = data.result

          dispatch(createNewSubmission({ ...result, orderId: result.id }))
        }
      },
    }),

    deleteOrderItem: builder.mutation<ApiResponse, number>({
      query: (orderItemId) => ({
        url: `order/items/${orderItemId}`,
        method: 'DELETE',
        headers: { hideToast: 'true' },
      }),
    }),

    processOrderPaymentByToken: builder.mutation<ApiResponse, {}>({
      query: (body) => ({
        url: '/guest/orderByToken/process-payment',
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
    processUpchargeAmount: builder.mutation<ApiResponse, {}>({
      query: (body) => ({
        url: '/guest/orderByToken/process-upcharge-payment',
        method: 'POST',
        body,
        headers: { hideToast: 'true' },
      }),
    }),
    createOrderOnBehalf: builder.mutation<ApiResponse, {}>({
      query: (body) => ({
        url: '/admin/submission/createOrderOnBehalf',
        method: 'POST',
        body,
        headers: { hideToast: 'false' },
      }),
    }),
    markOrderDelivered: builder.mutation<ApiResponse, number>({
      query: (orderId) => ({
        url: `order/mark-delivered/${orderId}`,
        method: 'PATCH',
        headers: { hideToast: 'false' },
      }),
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useCreateDraftOrderMutation,
  useUpdateDraftOrderMutation,
  useGetOrderDetailsByIdQuery,
  useDeleteOrderItemMutation,
  useCreateOrderOnBehalfMutation,
  useProcessOrderPaymentByTokenMutation,
  useProcessUpchargeAmountMutation,
  useMarkOrderDeliveredMutation,
} = extendedApi
