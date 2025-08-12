import Grid from '@mui/material/Grid2'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, useWatch } from 'react-hook-form'
import { FormLabel, Stack, Typography, Button } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'

import Profile from '@/components/GeneralSettings/Profile'
import Address from '@/components/GeneralSettings/Address'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import SelectOption from '@/components/_ui/selectOption/Select.component'
import OrderSummary from '@/components/orderSummary/OrderSummary.component'
import { schema, TSchema } from './OrderConfirmation.config'
import { createNewSubmission } from '@/redux/slice/newSubmission.slice'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { StepperProps } from '../../stepper.type'
import { useUpdateDraftOrderMutation } from '@/redux/api/createOrder.api'

function OrderConfirmation({ handleBack, handleNext, steps, activeStep }: StepperProps) {
  const router = useRouter()
  const dispatch = useReduxDispatch()
  const cardClean = ['Yes', 'No']
  const selectedService = useReduxSelector((state) => state.selectedService)
  const storeData = useReduxSelector((state) => state.selectedStore)
  const order = useReduxSelector((state: any) => state.newSubmission.order)
  const [updateDraftOrder] = useUpdateDraftOrderMutation()
  const ORDER_ID = router.query.ORDER_ID as string
  const [orderIdFromQuery, setOrderIdFromQuery] = useState<string | null>(null)

  const { currency_symbol, currency_code } = useReduxSelector((state) => state.selectedStore)

  const [wantCardClean, setWantCardClean] = useState<boolean>(true)
  const flatRateShipping = storeData.storeShipping.find((shipping: any) => shipping.shipping_key === 'flat_rate')
  const shipping = useMemo(() => {
    const options = []
    if (storeData.psaSettings.enable_dropoff) options.push('Drop Off')
    if (storeData.psaSettings.enable_shipping) options.push('Shipping')
    return options
  }, [storeData])

  useEffect(() => {
    if (router.isReady && router.query.ORDER_ID) {
      const id = router.query.ORDER_ID
      setOrderIdFromQuery(id as string)
    }
  }, [router.isReady, router.query.ORDER_ID])

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...order?.orderCustomer,
      submissionLevel: `${selectedService.name} ${currency_symbol} ${selectedService.cost} p/card max value ${currency_symbol} ${selectedService.max_declared_value} ${currency_code}`,
      numberOfCards: order.orderItems.length,
      costPerCardForCleaning: storeData.psaSettings.card_cleaning_fees || 0,
      costPerCard: selectedService.cost,
      discountpercard: selectedService.bulk_discount,
      minQuantityDiscount: selectedService.quantity,
      shippingCost: flatRateShipping ? flatRateShipping.cost : 0,
      discount: 0,
    },
  })

  const numberOfCards = useWatch({ control, name: 'numberOfCards' })
  const costPerCard = useWatch({ control, name: 'costPerCard' })
  const costPerCardForCleaning = useWatch({ control, name: 'costPerCardForCleaning' })
  const discountpercard = useWatch({ control, name: 'discountpercard' })
  const minQuantityDiscount = useWatch({ control, name: 'minQuantityDiscount' })
  const shippingCost = useWatch({ control, name: 'shippingCost' })
  const selectedShippingMethod = useWatch({ control, name: 'shipping' })

  const totalCost = numberOfCards * costPerCard
  const totalCostForCleaning = wantCardClean ? numberOfCards * costPerCardForCleaning : 0
  const sub_total = totalCost + (wantCardClean ? totalCostForCleaning : 0)
  const totalDiscount = numberOfCards >= minQuantityDiscount ? numberOfCards * discountpercard : 0
  const totalPayment = totalCost + totalCostForCleaning - totalDiscount + shippingCost

  useEffect(() => {
    setValue('totalCost', totalCost)
    setValue('totalCostForCleaning', totalCostForCleaning)
    setValue('totalDiscount', totalDiscount)
    setValue('totalPayment', totalPayment)
    setValue('sub_total', sub_total)
  }, [setValue, totalCost, totalCostForCleaning, totalDiscount, totalPayment, sub_total])

  useEffect(() => {
    if (selectedShippingMethod === 'Drop Off') {
      setValue('shippingCost', 0)
    } else {
      setValue('shippingCost', flatRateShipping ? flatRateShipping.cost : 0)
    }
  }, [selectedShippingMethod, setValue, flatRateShipping])

  const handleCardClean = (event: any) => {
    const selectedValue = event.target.value as string
    setWantCardClean(selectedValue === 'Yes')
  }

  const onSubmit = async (data: TSchema) => {
    const payload = {
      ...order,
      status: 'draft',
      quantity: numberOfCards,
      storeId: order.storeId,
      rate: selectedService.cost,
      discount: data.totalDiscount,
      sub_total: sub_total,
      shipping_total: shippingCost,
      total: totalPayment,
      currency_code: currency_code,
      currency_symbol: currency_symbol,
      orderItems: order.orderItems.map((item: any) => ({
        uid: item.uid,
        image_link: item.image_link,
        card_name: item.card_name,
        declared_value: item.declared_value,
      })),
      orderPSAService: {
        psa_selected_services: order.orderPSAService.psa_selected_services,
        card_cleaning: wantCardClean,
        quantity: wantCardClean ? numberOfCards : 0,
        rate: wantCardClean ? selectedService.cost : 0,
        total: wantCardClean ? totalCostForCleaning : 0,
      },
    }

    dispatch(createNewSubmission(payload))
    await updateDraftOrder({ orderId: Number(orderIdFromQuery), payload: payload }).unwrap()

    router.push('/customer/dashboard/paymentMethod')
  }

  return (
    <Stack sx={{ width: '100%', mx: 'auto', p: 1 }} spacing={2}>
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
        {storeData.psaSettings.enable_card_cleaning && (
          <Grid container alignItems="center" spacing={1}>
            <Grid size={{ xs: 6, md: 4 }}>
              <FormLabel>Would you like to clean your cards prior to submission?</FormLabel>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <SelectOption name="card_cleaning" options={cardClean} control={control} inputProps={{ 'aria-label': 'Cleaning option' }} onChange={handleCardClean} defaultValue={wantCardClean ? 'Yes' : 'No'} />
            </Grid>
          </Grid>
        )}

        <Grid container alignItems="center" spacing={1}>
          <Grid size={{ xs: 6, md: 4 }}>
            <FormLabel>Are you shipping or dropping off your cards to "{storeData.name}"?</FormLabel>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <SelectOption name="shipping" options={shipping} control={control} defaultValue={shipping[0]} inputProps={{ 'aria-label': 'Shipping option' }} />
          </Grid>
        </Grid>

        {selectedShippingMethod === 'Shipping' && (
          <Grid container alignItems="center" spacing={1}>
            <Grid size={{ xs: 6, md: 4 }}>
              <FormLabel>Shipping Cost</FormLabel>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextInput name="shippingCost" control={control} disabled />
            </Grid>
          </Grid>
        )}

        <Typography variant="body2">
          If shipping is required from {storeData.name} back to you once the cards have returned from PSA/BGS, there will be additional charges calculated once the cards have been returned.
        </Typography>
        {/* Order Summary Section */}
        <OrderSummary control={control} currency_symbol={currency_symbol} wantCardClean={wantCardClean} />

        <Stack spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Stack direction={'row'} mt={2} justifyContent={'space-between'}>
              <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button type="submit" variant="contained">
                {activeStep === (steps?.length || 0) - 1 ? 'Checkout' : 'Next'}
              </Button>
            </Stack>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default OrderConfirmation
