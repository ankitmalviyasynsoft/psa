import { RegisterDTO } from '@/dto/Register.dto'
import { api } from './api.config'
import { ApiResponse } from '@/pages/auth/Auth.type'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse, RegisterDTO>({
      query: (body) => ({
        url: 'auth/signup',
        method: 'POST',
        body,
        headers: { modal: 'true' },
      }),
    }),
    verifyAccount: builder.mutation<ApiResponse, { token: string }>({
      query: (body) => ({
        url: 'auth/verifyAccount',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<ApiResponse, { email: string; password: string; isAdmin: boolean; isSuperAdmin: boolean }>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
        headers: { modal: 'true' },
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (body) => ({
        url: '/auth/forgotPassword',
        method: 'POST',
        body,
      }),
    }),
    verifyUpdatePassword: builder.mutation<ApiResponse, { newPassword: string; token: any }>({
      query: (body) => ({
        url: '/auth/verifyUpdatePassword',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useRegisterMutation, useVerifyAccountMutation, useLoginMutation, useForgotPasswordMutation, useVerifyUpdatePasswordMutation } = extendedApi
