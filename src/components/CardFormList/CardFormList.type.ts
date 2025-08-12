import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

export interface CardFormListProps {
  fields: any[]
  control: Control<any>
  errors: any
  register: UseFormRegister<any>
  update: (index: number, value: any) => void
  remove: (index: number) => void
  refetch: () => void
  clearErrors: (name?: any) => void
  trigger: (name?: any) => void
  cardList: any[]
  debouncedSearch: (val: string) => void
  setValue: any
  append: (value: any) => void
  handleAddCard: () => void
  submitForm: (draft: boolean) => void
  currency_symbol: string
  setIsCustomCardFormOpen: (open: boolean) => void
}
