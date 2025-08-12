import { TPaginationApiParams } from '@/types/PaginationApiParams.type'
import { api } from './api.config'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerSubmissionList: builder.query<any, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `order/submission-list?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getOrderList: builder.query<any, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `order/list?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getOrderSubmissionDetailsById: builder.query<any, TPaginationApiParams>({
      query: ({ id, searchVal, page, limit }) => ({
        url: `order/submission-number/${id}?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getOrderDetailsById: builder.query<any, TPaginationApiParams>({
      query: ({ id, searchVal, page, limit }) => ({
        url: `order/getOrderByID/${id}?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
  }),
})

export const { useGetCustomerSubmissionListQuery, useGetOrderSubmissionDetailsByIdQuery, useGetOrderListQuery, useGetOrderDetailsByIdQuery } = extendedApi
