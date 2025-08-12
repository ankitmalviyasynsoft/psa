import { TPaginationApiParams } from '@/types/PaginationApiParams.type'
import { api } from './api.config'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerList: builder.query<any, TPaginationApiParams>({
      query: (params) => ({ url: '/user/profile/getAllCustomer', params, headers: { hideToast: 'true' } }),
    }),

    getCustomerDetailsById: builder.query<any, string>({
      query: (id) => ({ url: `/user/profile/getUserDetails/${id}`, headers: { hideToast: 'true' } }),
    }),

    createUserOnBehalf: builder.mutation<any, {}>({
      query: (body) => ({
        url: 'user/profile/createUserByAdmin',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetCustomerListQuery, useLazyGetCustomerDetailsByIdQuery, useCreateUserOnBehalfMutation } = extendedApi
