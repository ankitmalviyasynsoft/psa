import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Stack, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

import Profile from '@/components/GeneralSettings/Profile'
import Address from '@/components/GeneralSettings/Address'
import { schema, TSchema } from './CustomerDetails.config'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { createNewSubmission } from '@/redux/slice/newSubmission.slice'
import { useCreateDraftOrderMutation, useUpdateDraftOrderMutation } from '@/redux/api/createOrder.api'
import { extractCustomerDetails } from './CustomerDetails.utils'

type Props = {
  handleBack: () => void
  handleNext: () => void
  steps: string[]
  activeStep: number
  showButton?: boolean
}

const CustomerDetails = ({ handleBack, handleNext, steps, activeStep, showButton = true }: Props) => {
  const dispatch = useReduxDispatch()
  const router = useRouter()

  const profile = useReduxSelector((state) => state.profile.profile)
  const order = useReduxSelector((state) => state.newSubmission.order)
  const orderCustomer = useReduxSelector((state) => state.newSubmission.order.orderCustomer)
  const storeData = useReduxSelector((state) => state.selectedStore)
  const [newlyCreatedOrderId, setNewlyCreatedOrderId] = useState<number | null>(null)

  const [updateDraftOrder] = useUpdateDraftOrderMutation()
  const [createDraftOrder] = useCreateDraftOrderMutation()

  const defaultValues = orderCustomer?.firstName ? extractCustomerDetails(orderCustomer) : extractCustomerDetails(profile)

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    if (newlyCreatedOrderId) {
      handleNext()
    }
  }, [newlyCreatedOrderId])

  const onSubmit = async (formData: TSchema) => {
    const flattenedCustomer = {
      ...formData,
      ...formData.userDetails,
    }
    const finalPayload = {
      ...order,
      orderCustomer: flattenedCustomer,
    }
    if (order.orderId === null) {
      const { orderId } = await createDraftOrder({ orderCustomer: flattenedCustomer, storeId: storeData.id }).unwrap()

      dispatch(createNewSubmission({ ...order, orderCustomer: flattenedCustomer, orderId }))

      router.replace({ pathname: router.pathname, query: { ...router.query, ORDER_ID: orderId } }, undefined, { shallow: true })
      setNewlyCreatedOrderId(orderId)

      return
    } else if (isDirty) {
      await updateDraftOrder({ orderId: order.orderId, payload: finalPayload }).unwrap()
    }
    dispatch(createNewSubmission({ ...order, orderCustomer: flattenedCustomer }))
    handleNext()
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Typography variant="h6">Customer Details</Typography>

        <Grid container spacing={2}>
          <Profile control={control} errors={errors} isEmailDisabled />
        </Grid>

        <Grid container spacing={2}>
          <Address control={control} errors={errors} />
        </Grid>

        {showButton && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button variant="contained" type="submit">
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}

export default CustomerDetails
