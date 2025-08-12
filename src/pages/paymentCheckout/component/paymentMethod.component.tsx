import Image from 'next/image'
import Grid from '@mui/material/Grid2'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Radio, RadioGroup, FormControlLabel, FormControl, Stack, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import RenderContent from '@/components/renderContent/RenderContent.component'
import { useReduxSelector } from '@/hooks'
import { useProcessOrderPaymentByTokenMutation } from '@/redux/api/createOrder.api'
import { validatePayloadSignature } from '@/utils/createSignature.util'
import { useGetPaymentMethodsByIdQuery } from '@/redux/api/getPaymentMethodList.api'

interface PaymentMethodProps {
  openModal: boolean
  onClose: () => void
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({ openModal, onClose }) => {
  const [processOrderPaymentByToken] = useProcessOrderPaymentByTokenMutation()
  const order = useReduxSelector((state: any) => state.newSubmission.order)

  const storeId = order?.storeId
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

  const onSubmit = async (data: any) => {
    const finalPayload = {
      orderId: order.orderId,
      userId: order.userId,
      total: order.total,
      orderTransaction: {
        payment_method: data.payment_method,
      },
      currency_code: order.currency_code,
      customerEmail: orderCustomer.email,
      storeId,
    }

    const signature = await validatePayloadSignature(finalPayload)

    const payloadWithSignature = { ...finalPayload, signature }

    const response = await processOrderPaymentByToken(payloadWithSignature).unwrap()

    if (response?.statusCode === 200) {
      if (typeof response?.result === 'string') {
        window.location.href = response.result
      }
    }
  }

  return (
    <Dialog open={openModal} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Payment Method</DialogTitle>
      <RenderContent loading={isLoading} error={isError}>
        <DialogContent>
          <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
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
                <Button variant="outlined" color="inherit" onClick={() => onClose()} sx={{ mr: 2 }}>
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
        </DialogContent>
      </RenderContent>
    </Dialog>
  )
}
