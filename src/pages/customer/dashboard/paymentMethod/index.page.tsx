import Image from 'next/image'
import Grid from '@mui/material/Grid2'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stack, Typography, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'

import RenderContent from '@/components/renderContent/RenderContent.component'
import { useReduxSelector } from '@/hooks'
import { useCreateOrderMutation } from '@/redux/api/createOrder.api'
import { validatePayloadSignature } from '@/utils/createSignature.util'
import { useGetPaymentMethodsByIdQuery } from '@/redux/api/getPaymentMethodList.api'

const PaymentMethod = () => {
  const router = useRouter()
  const [createOrder] = useCreateOrderMutation()
  const order = useReduxSelector((state: any) => state.newSubmission.order)
  const storeData = useReduxSelector((state) => state.selectedStore)
  const profile = useReduxSelector((state) => state.profile.profile)

  const storeId = storeData?.psaSettings?.storeId
  const orderCustomer = order?.orderCustomer

  const { data: getAvailablePaymentList, isLoading, isError } = useGetPaymentMethodsByIdQuery(storeId, { skip: !storeId })

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: { payment_method: '' },
  })

  const paymentMethod = watch('payment_method')
  const availablePaymentMethods = getAvailablePaymentList?.result.filter((method: any) => method.status) || []

  useEffect(() => {
    if (order.storeId === null) {
      router.push('/customer/dashboard')
    }
  }, [order.storeId, router])

  const onSubmit = async (data: any) => {
    const { userDetails, ...restOrderCustomer } = orderCustomer

    const finalPayload = {
      ...order,
      userId: profile?.id,
      orderTransaction: {
        payment_method: data.payment_method,
      },
      orderCustomer: {
        ...restOrderCustomer,
        // ...userDetails,
      },
    }

    const signature = await validatePayloadSignature(finalPayload)

    const payloadWithSignature = { ...finalPayload, signature }

    const response = await createOrder(payloadWithSignature).unwrap()

    if (response?.statusCode === 200) {
      if (typeof response?.result === 'string') {
        window.location.href = response.result
      }
    }
  }

  const handleBack = () => {
    window.location.href = `/customer/dashboard/new-submission/${storeData?.slug}?ORDER_ID=` + order.orderId
  }

  return (
    <RenderContent loading={isLoading} error={isError}>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>Select Payment Method</FormLabel>
          <RadioGroup sx={{ my: 1 }} value={paymentMethod} onChange={(e) => setValue('payment_method', e.target.value)}>
            {availablePaymentMethods.map((method: any) => (
              <FormControlLabel
                key={method.id}
                value={method.key}
                control={<Radio />}
                label={
                  <div>
                    <Image src={`/${method.key}.png`} alt={method.name} width={100} height={50} onError={(e: any) => (e.target.src = '/placeholder.png')} />
                  </div>
                }
              />
            ))}
            {availablePaymentMethods.length === 0 && (
              <Typography variant="body1" color="textSecondary" align="center">
                No payment methods available.
              </Typography>
            )}
          </RadioGroup>
        </FormControl>

        {getAvailablePaymentList?.result?.length > 0 && (
          <Grid container justifyContent="center" display="flex" alignItems="center">
            <Button variant="outlined" color="inherit" onClick={() => handleBack()} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting} disabled={availablePaymentMethods.length === 0 || paymentMethod === ''}>
              {' '}
              {/* Disable button if no payment methods */}
              Submit
            </LoadingButton>
          </Grid>
        )}
      </Stack>
    </RenderContent>
  )
}

PaymentMethod.layoutProps = {
  title: 'Final Submission',
  pageType: 'protected',
  roles: 'customer',
}

export default PaymentMethod
