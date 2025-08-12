import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie } from '@/utils/cookie.util'

export const api = createApi({
  reducerPath: 'apis',
  tagTypes: ['PSA_SUBMISSION', 'TEMP_SUBMISSION_BY_ID', 'PROFILE_DETAILS'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, {}) => {
      if (getCookie('token')) headers.set('Authorization', `Bearer ${getCookie('token')}`)
      return headers
    },
  }),
  endpoints: () => ({}),
})
