import React, { useState } from 'react'
import { Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import CustomerForm from './components/customerForm/customerForm.component'
import SubmissionForm from './components/submissionForm/submissionForm.component'
import { style } from './createOrder.style'

const steps = ['Customer Details', 'Submission Details']

function createOrder() {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  return (
    <Stack sx={style.root}>
      <PageHeader title="Create Order" />
      <Stack sx={style.cardStyle}>
        <>
          <Stepper activeStep={activeStep} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 3 }}>
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {}
              const labelProps: {
                optional?: React.ReactNode
              } = {}
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} {...labelProps}>
                    <Typography variant="body1">{label}</Typography>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
          {activeStep < steps.length && (
            <>
              {activeStep === 0 && (
                <Stack sx={{ mt: 2, mb: 1 }}>
                  <CustomerForm handleNext={handleNext} handleBack={handleBack} activeStep={activeStep} steps={steps} showButton="true" maxWidth={'100%'} />
                </Stack>
              )}
              {activeStep === 1 && (
                <Stack sx={{ mt: 2, mb: 1 }}>
                  <SubmissionForm handleNext={handleNext} handleBack={handleBack} activeStep={activeStep} steps={steps} />
                </Stack>
              )}
            </>
          )}
        </>
      </Stack>
    </Stack>
  )
}

createOrder.layoutProps = {
  title: 'Create Order',
  pageType: 'protected',
  roles: 'admin',
}

export default createOrder
