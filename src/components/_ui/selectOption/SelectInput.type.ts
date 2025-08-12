import { SelectChangeEvent, TextFieldProps } from '@mui/material'
import { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'

export type SelectOptionProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<TextFieldProps, 'onChange'> & {
  name: TName
  options: string[]
  defaultValue?: string | null
  control: Control<TFieldValues>
  variant?: 'filled' | 'outlined' | 'standard'
  onChange?: (event: SelectChangeEvent<string>, field: ControllerRenderProps<TFieldValues, TName>, value: string | null) => void
}
