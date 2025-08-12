import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useGetPaymentStatusForExternalMutation, useGetPaymentStatusMutation, useGetUpchargePaymentStatusMutation } from '@/redux/api/paymentStatus.api'

export const useOrderStatus = () => {
  const router = useRouter()
  const queryParams = router.query

  const [getPaymentStatus] = useGetPaymentStatusMutation()
  const [getPaymentStatusForExternal] = useGetPaymentStatusForExternalMutation()
  const [getUpchargePaymentStatus] = useGetUpchargePaymentStatusMutation()
  const [orderStatus, setOrderStatus] = useState<{
    total_amount?: number
    orderId?: number
    payment_status?: string
    currency_symbol?: string
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const accessCode = queryParams?.AccessCode || queryParams.token || ''
        const unique_id = queryParams?.unique_id || ''
        const orderId = queryParams?.ORDER_ID
        const type = queryParams?.type

        let response
        if (type === 'payment') {
          response = await getPaymentStatusForExternal({ accessCode, orderId, unique_id }).unwrap()
        } else if (type === 'upcharge') {
          response = await getUpchargePaymentStatus({ accessCode, orderId, unique_id }).unwrap()
        } else {
          response = await getPaymentStatus({ accessCode, orderId, unique_id }).unwrap()
        }

        if (response?.result) {
          setOrderStatus(response?.result)
        } else {
          setOrderStatus(null)
        }
      } catch (error) {
        console.error('Failed to fetch order status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (Object.keys(queryParams).length > 0) {
      fetchOrderStatus()
    }
  }, [queryParams, getPaymentStatus])

  return { orderStatus, isLoading }
}
