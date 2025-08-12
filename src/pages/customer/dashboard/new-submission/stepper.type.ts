export type StepperProps = {
  handleNext?: () => void
  handleBack?: () => void
  ORDER_ID?: string
  activeStep?: number
  steps?: string[]
  showButton?: boolean | string
  orderData?: any
}
