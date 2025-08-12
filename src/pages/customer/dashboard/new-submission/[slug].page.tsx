import React, { useState, useEffect, useMemo } from 'react'
import { Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import CustomerDetails from '@/pages/customer/dashboard/new-submission/components/customerDetails/CustomerDetails.component'
import SubmissionDetails from '@/pages/customer/dashboard/new-submission/components/submissionDetails/SubmissionDetails.component'
import OrderConfirmation from '@/pages/customer/dashboard/new-submission/components/orderConfirmation/OrderConfirmation.component'
import { style } from './new-submission.style'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { useLazyGetStoreDetailsByIdQuery } from '@/redux/api/store.api'
import { setStoreData } from '@/redux/slice/selectedStore'
import { useGetOrderDetailsByIdQuery } from '@/redux/api/createOrder.api'
import { createNewSubmission } from '@/redux/slice/newSubmission.slice'
import RenderContent from '@/components/renderContent/RenderContent.component'

const steps = ['Customer Details', 'Submission Details', 'Order Confirmation']

const stepComponents = [CustomerDetails, SubmissionDetails, OrderConfirmation]

function NewSubmission() {
  const router = useRouter()
  const dispatch = useReduxDispatch()
  const [getStoreDetailsById] = useLazyGetStoreDetailsByIdQuery()
  const { slug } = router.query as { slug: string }
  const orderIdFromUrl = router.query.ORDER_ID ? Number(router.query.ORDER_ID) : null

  const reduxOrderId = useReduxSelector((state) => state.newSubmission.order.orderId)
  const shouldFetchOrder = !!orderIdFromUrl && !reduxOrderId

  const { data, isLoading, isError } = useGetOrderDetailsByIdQuery(orderIdFromUrl!, {
    skip: !shouldFetchOrder,
  })

  const storeData = useReduxSelector((state) => state.selectedStore)
  const storeName = storeData?.name || ''

  useEffect(() => {
    if (!slug) return
    const fetchStore = async () => {
      try {
        const response = await getStoreDetailsById(slug).unwrap()
        if (response.result) {
          if (response.result?.psaSettings?.enable_psa_submissions) {
            dispatch(setStoreData(response.result))
            localStorage.setItem('selectedStore', JSON.stringify(response.result))
          } else {
            toast.error('Store PSA submissions not enabled.')
            router.push('/')
          }
        } else {
          toast.error('Invalid store slug')
          router.push('/')
        }
      } catch (error) {
        toast.error('Invalid store slug')
        router.push('/')
      }
    }

    fetchStore()
  }, [slug])

  // useEffect(() => {
  //   if (orderIdFromUrl && !reduxOrderId) {
  //     dispatch(createNewSubmission({ ...order, orderId: orderIdFromUrl }))
  //   }
  // }, [orderIdFromUrl])

  // useEffect(() => {
  //   if (orderIdFromUrl && orderId === null) {
  //     getOrderDetailsById(Number(orderIdFromUrl)).unwrap()
  //   }
  // }, [orderIdFromUrl])

  const [activeStep, setActiveStep] = useState(0)
  const handleNext = () => setActiveStep((prev) => prev + 1)
  const handleBack = () => setActiveStep((prev) => prev - 1)

  const StepContent = stepComponents[activeStep]

  return (
    <Stack sx={style.root}>
      <PageHeader title={`New Submission${storeName ? ` (Store Name: ${storeName})` : ''}`} />

      <Stack sx={style.cardStyle}>
        <Stepper activeStep={activeStep} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <RenderContent loading={isLoading} error={isError}>
          {activeStep < steps.length && StepContent && (
            <Stack sx={{ mt: 2, mb: 1 }}>
              <StepContent handleNext={handleNext} handleBack={handleBack} activeStep={activeStep} steps={steps} {...(activeStep === 0 && { showButton: true, maxWidth: '100%' })} />
            </Stack>
          )}
        </RenderContent>
      </Stack>
    </Stack>
  )
}

NewSubmission.layoutProps = {
  title: 'New Submission',
  pageType: 'protected',
  roles: 'customer',
}

export default NewSubmission
