import { toast } from 'react-toastify'

import { isRejectedWithValue, isFulfilled } from '@reduxjs/toolkit'
import { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'

export const rtkQueryLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: any) => {
  if (isRejectedWithValue(action)) handleRejectedAction(action)
  if (isFulfilled(action)) handleFulfilledAction(action)
  return next(action)
}

const handleRejectedAction = (action: any) => {
  const { payload, meta } = action
  console.error(`😲 OMG Api Failed - Details: `, action)
  const status = meta.baseQueryMeta.response?.status
  const errorMessage = getErrorMessage(status, payload?.data?.message)
  const showModal = meta.baseQueryMeta.request.headers.get('modal') === 'true'

  if (showModal) return
  if (payload.status !== 'PARSING_ERROR') toast.error(errorMessage)
}

const handleFulfilledAction = (action: any) => {
  const { payload, meta } = action
  let message = payload?.message
  const method = meta.baseQueryMeta.request.method
  const hideToast = meta.baseQueryMeta.request.headers.get('hideToast') === 'true'
  const showModal = meta.baseQueryMeta.request.headers.get('modal') === 'true'
  if (showModal) return
  if (!hideToast) toast.success(message)
}

const getErrorMessage = (status: number, message: string) => {
  switch (status) {
    case 0:
      return 'Server unreachable. Check your internet connection'
    case 429:
      return 'Too many requests: You have exceeded the rate limit'
    case 503:
      return 'Service temporarily unavailable: Please try again later'
    default:
      if (status >= 500) return message || 'Sorry! Something went wrong with server'
      return message || 'Sorry! Something went wrong'
  }
}
