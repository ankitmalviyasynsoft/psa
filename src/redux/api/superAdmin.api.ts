import { TPaginationApiParams } from '@/types/PaginationApiParams.type'
import { api } from './api.config'
import { PaginationApiResponse } from '@/types/PaginationApiResponse.type'
import { UserProfile } from '@/dto/UserProfile.dto'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerList: builder.query<PaginationApiResponse<UserProfile>, TPaginationApiParams>({
      query: (params) => ({ url: 'superadmin/getAllCustomer', params, headers: { hideToast: 'true' } }),
    }),
    getRetailerList: builder.query<PaginationApiResponse<UserProfile>, TPaginationApiParams>({
      query: (params) => ({ url: 'superadmin/getAllRetailers', params, headers: { hideToast: 'true' } }),
    }),
    getImpersonateLoginToken: builder.query<{ statusCode: number; message: string; result: { token: string } }, string>({
      query: (id) => ({ url: `superadmin/impersonate/${id}`, headers: { hideToast: 'true' } }),
    }),
    getUnapprovedRetailerList: builder.query<PaginationApiResponse<UserProfile>, TPaginationApiParams>({
      query: ({ searchVal, page, limit }) => ({
        url: `superadmin/getAllUnApprovedRetailers?page=${page}&limit=${limit}&sortOrder=desc&searchVal=${searchVal}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    approveRetailer: builder.mutation<void, number>({
      query: (userId) => ({
        url: `superadmin/approve-retailer/${userId}`,
        method: 'POST',
        headers: { hideToast: 'false' },
      }),
    }),
    getAverageSubmissionTimes: builder.query<{ result: { key: string; label: string; value: number; suffix: string; show: boolean }[] }, void>({
      query: () => ({
        url: `superadmin/analytics/getAverageSubmissionTimes`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
    getCardSubmissionAnalytics: builder.query<{ result: { date: string; total: number }[]; totalCardsSubmittedToPSA: number }, { unit: string; duration: number }>({
      query: ({ unit, duration }) => ({
        url: `superadmin/analytics/getCardSubmissionAnalytics?unit=${unit}&duration=${duration}`,
        method: 'GET',
        headers: { hideToast: 'true' },
      }),
    }),
  }),
})

export const {
  useGetCustomerListQuery,
  useGetRetailerListQuery,
  useLazyGetImpersonateLoginTokenQuery,
  useGetUnapprovedRetailerListQuery,
  useApproveRetailerMutation,
  useGetAverageSubmissionTimesQuery,
  useLazyGetCardSubmissionAnalyticsQuery,
} = extendedApi
