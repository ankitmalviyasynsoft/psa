import { PaginationApiResponse } from '@/types/PaginationApiResponse.type'
import { api } from './api.config'
import { TPaginationApiParams } from '@/types/PaginationApiParams.type'
import { OrderItemDTO } from '@/dto/Order.dto'
import { BasicResponse } from '@/types/basicResponse.type'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerPurchaseOrderItems: builder.query<PaginationApiResponse<OrderItemDTO>, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `order/getCustomerPurchaseOrderItems?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getRetailorPurchaseOrderItems: builder.query<PaginationApiResponse<OrderItemDTO>, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `order/getRetailorPurchaseOrderItems?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getSellOrderItems: builder.query<any, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `order/getSellOrderItems?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    updateOrderItemStatus: builder.mutation<BasicResponse, { orderItemId: number; status: string; boughtBy?: string }>({
      query: (body) => ({
        url: `order/updateOrderItemStatus`,
        method: 'POST',
        body: body,
        headers: { hideToast: 'true' },
      }),
    }),
  }),
})

export const { useGetCustomerPurchaseOrderItemsQuery, useGetSellOrderItemsQuery, useGetRetailorPurchaseOrderItemsQuery, useUpdateOrderItemStatusMutation } = extendedApi
