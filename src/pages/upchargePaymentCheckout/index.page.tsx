import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormLabel, Stack, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import WebsiteLoader from '@/components/_ui/websiteLoader/WebsiteLoader.component'
import Profile from '@/components/GeneralSettings/Profile'
import Address from '@/components/GeneralSettings/Address'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import { schema, TSchema } from './upchargePaymentCheckout.config'
import { Page } from '@/types/page.type'
import { style } from './upchargePaymentCheckout.style'
import { useLazyGetUpchargeDetailsQuery } from '@/redux/api/getOrderByToken.api'
import { PaymentMethod } from './component/paymentMethod.component'

const UpchargePaymentCheckout: Page = () => {
  const router = useRouter()

  const token = router.query.token as string
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)
  const [isFormReady, setIsFormReady] = useState(false)
  const [calculatedTotalUpcharge, setCalculatedTotalUpcharge] = useState(0)

  const [triggerGetUpchargeDetails, { data, isLoading }] = useLazyGetUpchargeDetailsQuery()

  useEffect(() => {
    if (token) {
      triggerGetUpchargeDetails(token)
    }
  }, [token, triggerGetUpchargeDetails])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (data?.result?.due_amount <= 0) {
      toast.success('Payment has already been done.')
      router.push('/auth/login')
    }
  }, [data, router])

  useEffect(() => {
    if (data?.result) {
      const orderData = data.result
      const orderCustomer = orderData.orderCustomer
      const upchargeTotal = orderData.orderItems.reduce((sum: number, item: any) => sum + (item.upcharge_amount || 0), 0)

      setCalculatedTotalUpcharge(upchargeTotal)
      reset({
        ...orderCustomer,
        userDetails: {
          address_1: orderCustomer.address_1,
          address_2: orderCustomer.address_2,
          city: orderCustomer.city,
          state: orderCustomer.state,
          zip_code: orderCustomer.zip_code,
        },
        totalPayment: upchargeTotal,
      })
    }
    setIsFormReady(true)
  }, [data, reset])

  const handleOpenModal = () => setIsPaymentMethodOpen(true)

  const handleCloseModal = () => setIsPaymentMethodOpen(false)

  const onSubmit = async (data1: TSchema) => {
    handleOpenModal()
  }

  if (isLoading || !isFormReady) {
    return <WebsiteLoader />
  }

  return (
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

        <Typography variant="h6">Additional Payment Summary</Typography>
        <Stack spacing={2} maxWidth="sm">
          {data?.result?.orderItems.map((item: any, index: any) => {
            return (
              <Grid container spacing={2} key={item.id}>
                <Grid size={{ md: 4, xs: 12 }}>
                  <FormLabel>Card Name</FormLabel>
                  <TextInput name={`orderItems.${index}.card_name`} control={control} defaultValue={item.card_name} disabled />
                </Grid>
                <Grid size={{ md: 4, xs: 12 }}>
                  <FormLabel>Upcharge Amount</FormLabel>
                  <TextInput name={`orderItems.${index}.upcharge_amount`} control={control} defaultValue={item.upcharge_amount} currency_symbol={data?.result?.currency_symbol} disabled />
                </Grid>
              </Grid>
            )
          })}
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ md: 6, xs: 12 }}>
            <FormLabel>Total Payment Required</FormLabel>
            <TextInput name="totalPayment" control={control} currency_symbol={data?.result?.currency_symbol} disabled />
          </Grid>
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Checkout
          </LoadingButton>
        </Grid>
      </Stack>
      <PaymentMethod openModal={isPaymentMethodOpen} onClose={handleCloseModal} storeId={data?.result?.storeId} orderData={data?.result} totalUpcharge={calculatedTotalUpcharge} />
    </Stack>
  )
}

UpchargePaymentCheckout.layoutProps = {
  title: 'Upcharge Payment Checkout',
  pageType: 'public',
  header: false,
  sidebar: false,
  footer: false,
}

export default UpchargePaymentCheckout
