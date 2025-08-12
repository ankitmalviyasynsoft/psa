import { Control } from 'react-hook-form'

export interface OrderSummaryProps {
  control: Control<any>
  currency_symbol?: string
  wantCardClean?: boolean
}
