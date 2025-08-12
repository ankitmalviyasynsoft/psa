import { ChangeEvent } from 'react'
import { TextFieldProps } from '@mui/material'
import { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'

export type InputFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<TextFieldProps, 'onChange'> & {
  name: TName
  control: Control<TFieldValues>
  currency_symbol?: string
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: ControllerRenderProps<TFieldValues, TName>, value: string | null) => void
}
