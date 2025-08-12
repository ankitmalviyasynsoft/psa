import { Control } from 'react-hook-form'

export interface SubmissionFormHeaderProps {
  services: { name: string; cost: number }[]
  currency_symbol: string
  control: Control<any>
  handleLevelChange: (value: string) => void
}
