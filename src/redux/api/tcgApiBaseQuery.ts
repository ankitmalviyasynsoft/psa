import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const externalBaseQuery = fetchBaseQuery({
  baseUrl: '/api/tcg',
  prepareHeaders: (headers) => {
    const token = process.env.NEXT_PUBLIC_TCG_API_TOKEN
    if (token) headers.set('Authorization', `Bearer ${token}`)
    headers.set('Content-Type', 'application/json')
    return headers
  },
})
