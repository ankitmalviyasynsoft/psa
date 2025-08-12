import { Control, FieldPath, FieldValues } from 'react-hook-form'

export type PhoneFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  name: TName
  control: Control<TFieldValues>
  helperText?: string
  label?: string
  placeholder?: string
  readOnly?: boolean
} & React.HTMLAttributes<HTMLInputElement>
