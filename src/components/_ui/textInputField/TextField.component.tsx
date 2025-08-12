import { FormControl, FormLabel, InputAdornment, TextField } from '@mui/material'
import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { InputFieldProps } from './TextInput.type'

export default function TextInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: InputFieldProps<TFieldValues, TName>): JSX.Element {
  const { control, name, onChange, defaultValue, onBlur, label, currency_symbol, ...restProps } = props
  const isNumber = restProps.type === 'number'

  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel sx={{ mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ((isNumber ? null : '') as any)}
        render={({ fieldState: { error }, field }) => {
          const { ref, value, ...restField } = field

          return (
            <TextField
              {...restField}
              {...restProps}
              value={value ?? ''}
              inputRef={ref}
              error={!!error}
              fullWidth
              onBlur={(e) => {
                restField.onBlur()
                onBlur && onBlur(e)
              }}
              // onChange={(e) => {
              //   const newValue = isNumber ? e.target.value || null : e.target.value
              //   onChange ? onChange(e, field, newValue) : restField.onChange(newValue)
              // }}
              onChange={(e) => {
                let inputValue = e.target.value

                if (isNumber) {
                  let numericValue = parseFloat(inputValue)

                  // Prevent NaN values
                  if (isNaN(numericValue)) {
                    numericValue = 0
                  }

                  inputValue = numericValue.toString()
                }
                onChange ? onChange(e, field, inputValue) : restField.onChange(inputValue)
              }}
              inputProps={{
                ...(restProps.inputProps || {}),
                min: isNumber ? 0 : undefined,
              }}
              helperText={error ? error?.message : restProps.helperText}
              FormHelperTextProps={{ sx: { ml: 0 } }}
              {...(currency_symbol && {
                slotProps: {
                  input: {
                    endAdornment: <InputAdornment position="end">{currency_symbol}</InputAdornment>,
                  },
                },
              })}
            />
          )
        }}
      />
    </FormControl>
  )
}
