import { api } from './api.config'
import { removeCookie } from '@/utils/cookie.util'
import { setProfile } from '../slice/profile.slice'
import { UserProfile } from '@/dto/UserProfile.dto'
import { BasicResponse } from '@/types/basicResponse.type'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<{ result: UserProfile }, void>({
      query: () => ({
        url: 'user/profile/details',
        headers: { hideToast: 'true' },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          if (data?.result) {
            dispatch(setProfile(data.result))
          }
        } catch (error: any) {
          if (error?.meta?.response?.status === 401 || error?.error?.data?.response?.error == 'Unauthorized') {
            removeCookie('token')
            location.replace('/auth/login')
          }
        }
      },
      providesTags: ['PROFILE_DETAILS'],
    }),

    updateProfileAdmin: builder.mutation<BasicResponse, Partial<UserProfile>>({
      query: (body) => ({
        url: 'user/profile/updateAdmin',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PROFILE_DETAILS'],
    }),
    updateProfileCustomer: builder.mutation<BasicResponse, Partial<UserProfile>>({
      query: (body) => ({
        url: 'user/profile/updateUser',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PROFILE_DETAILS'],
    }),
    updatePassword: builder.mutation<BasicResponse, { isPasswordUpdate: boolean; password: string }>({
      query: (body) => ({
        url: '/user/profile/updatePassword',
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const { useLazyGetUserQuery, useUpdateProfileAdminMutation, useUpdateProfileCustomerMutation, useUpdatePasswordMutation } = extendedApi
