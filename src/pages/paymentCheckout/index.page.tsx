import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormLabel, Stack, Typography } from '@mui/material'

import WebsiteLoader from '@/components/_ui/websiteLoader/WebsiteLoader.component'
import Profile from '@/components/GeneralSettings/Profile'
import Address from '@/components/GeneralSettings/Address'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import OrderSummary from '@/components/orderSummary/OrderSummary.component'
import { createNewSubmission } from '@/redux/slice/newSubmission.slice'
import { useReduxDispatch } from '@/hooks'
import { schema, TSchema } from './paymentCheckout.config'
import { Page } from '@/types/page.type'
import { style } from './paymentCheckout.style'
import { useLazyGetOrderDetailsByTokenQuery } from '@/redux/api/getOrderByToken.api'
import { PaymentMethod } from './component/paymentMethod.component'
import { toast } from 'react-toastify'

const PaymentCheckout: Page = () => {
  const router = useRouter()
  const dispatch = useReduxDispatch()

  const token = router.query.token as string
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)

  const [triggerGetOrderDetails, { data, isLoading }] = useLazyGetOrderDetailsByTokenQuery()
  const currency_symbol = data?.result?.currency_symbol
  const wantCardClean = data?.result?.orderPSAService?.card_cleaning
  useEffect(() => {
    if (token) {
      triggerGetOrderDetails(token)
    }
  }, [token, triggerGetOrderDetails])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (data?.result?.payment_status === 'paid') {
      toast.success('Payment has already been done.')
      router.push('/auth/login')
    }
  }, [data, router])

  useEffect(() => {
    if (data?.result) {
      const orderData = data.result
      const orderCustomer = orderData.orderCustomer
      const orderPSAService = orderData.orderPSAService.psa_selected_services

      reset({
        ...orderCustomer,
        userDetails: {
          address_1: orderCustomer.address_1,
          address_2: orderCustomer.address_2,
          city: orderCustomer.city,
          state: orderCustomer.state,
          zip_code: orderCustomer.zip_code,
        },
        card_cleaning: orderData.orderPSAService.card_cleaning ? 'Yes' : 'No',
        shipping: 'shipping',
        shippingCost: orderData.shipping_total,
        submissionLevel: `${data.psa.name} - ${data.psa.cost} p/card`,
        discountpercard: 0,
        minQuantityDiscount: 0,
        numberOfCards: orderData.quantity,
        costPerCard: orderData.rate,
        totalCost: orderData.quantity * orderData.rate,
        costPerCardForCleaning: orderPSAService.card_cleaning_fees || 0,
        totalCostForCleaning: orderPSAService.card_cleaning_fees || 0,
        sub_total: orderData.sub_total,
        totalDiscount: orderData.discount,
        totalPayment: orderData.total,
        currency_code: orderData.currency_code,
        currency_symbol: orderData.currency_symbol,
        storeId: orderData.storeId,
        userId: orderData.userId,
        orderId: orderData.id,
      })
    }
  }, [data, reset])

  const handleOpenModal = () => setIsPaymentMethodOpen(true)

  const handleCloseModal = () => setIsPaymentMethodOpen(false)

  const onSubmit = async (data1: TSchema) => {
    dispatch(
      createNewSubmission({
        orderCustomer: {
          firstName: data?.result?.orderCustomer?.firstName,
          lastName: data?.result?.orderCustomer?.lastName,
          email: data?.result?.orderCustomer?.email,
          phone: data?.result?.orderCustomer?.phone,
          address_1: data?.result?.orderCustomer?.address_1,
          address_2: data?.result?.orderCustomer?.address_2,
          city: data?.result?.orderCustomer?.city,
          state: data?.result?.orderCustomer?.state,
          zip_code: data?.result?.orderCustomer?.zip_code,
        },
        status: 'pending',
        quantity: data1.numberOfCards,
        storeId: data1.storeId,
        userId: data1.userId,
        rate: data1.costPerCard,
        discount: data1.totalDiscount,
        sub_total: data1.sub_total,
        shipping_total: data1.shippingCost,
        total: data1.totalPayment,
        currency_code: data1.currency_code,

        // ✅ Include missing required properties
        currency_symbol: data1.currency_symbol, // provide the symbol or default
        orderTransaction: {
          payment_method: '', // provide value or default
        },

        orderId: data1.orderId,
        orderItems: data?.result?.orderItems.map((item: any) => ({
          card_name: item.card_name,
          declared_value: item.declared_value,
          uid: item.uid,
          image_link: item.image_link,
        })),
        orderPSAService: {
          psa_selected_services: data.result?.orderPSAService.psa_selected_services,
          card_cleaning: data.result?.orderPSAService.card_cleaning,
          quantity: data.result?.orderPSAService.quantity,
          rate: data.result?.orderPSAService.rate,
          total: data.result?.orderPSAService.total,
        },
      }),
    )

    handleOpenModal()
  }

  return isLoading ? (
    <WebsiteLoader />
  ) : (
    <Stack sx={style.cardStyle}>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">
          Order Confirmation
          <Typography variant="overline" ml={2}>
            PLEASE CHECK THE BELOW INFORMATION AND ENSURE THAT IT'S CORRECT
          </Typography>
        </Typography>

        <Grid container spacing={2}>
          <Profile control={control} errors={errors} disabled={true} isEmailDisabled={true} />
        </Grid>
        <Grid container spacing={2}>
          <Address control={control} errors={errors} disabled={true} />
        </Grid>

        <Typography variant="h6">Additional Items</Typography>

        <Grid container alignItems="center" spacing={1}>
          <Grid size={{ xs: 6, md: 4 }}>
            <FormLabel>Would you like to clean your cards prior to submission?</FormLabel>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <TextInput name="card_cleaning" control={control} disabled />
          </Grid>
        </Grid>

        <Grid container alignItems="center" spacing={1}>
          <Grid size={{ xs: 6, md: 4 }}>
            <FormLabel>Are you shipping or dropping off your cards to "{data?.storeData?.name}"?</FormLabel>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <TextInput name="shipping" control={control} disabled />
          </Grid>
        </Grid>

        <Grid container alignItems="center" spacing={1}>
          <Grid size={{ xs: 6, md: 4 }}>
            <FormLabel>Shipping Cost</FormLabel>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <TextInput name="shippingCost" control={control} currency_symbol={currency_symbol} disabled />
          </Grid>
        </Grid>

        <Typography variant="body2">
          If shipping is required from {data?.storeData?.name} back to you once the cards have returned from PSA/BGS, there will be additional charges calculated once the cards have been returned.
        </Typography>

        <OrderSummary control={control} wantCardClean={wantCardClean} currency_symbol={currency_symbol} />
        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Checkout
          </LoadingButton>
        </Grid>
      </Stack>
      <PaymentMethod openModal={isPaymentMethodOpen} onClose={handleCloseModal} />
    </Stack>
  )
}

PaymentCheckout.layoutProps = {
  title: 'Payment Checkout',
  pageType: 'public',
  header: false,
  sidebar: false,
  footer: false,
}

export default PaymentCheckout
