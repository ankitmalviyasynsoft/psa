import { FormHelperText, FormControl, FormLabel } from '@mui/material'
import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { PhoneFieldProps } from './PhoneField.type'
import { PhoneInput } from './PhoneField.style'

export default function PhoneField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: PhoneFieldProps<TFieldValues, TName>): JSX.Element {
  const { control, name, placeholder, label = 'Phone Number', onChange, onBlur, ...restProps } = props

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={'' as any}
      render={({ fieldState: { error }, field: { ref, ...restField } }) => (
        <>
          <FormLabel sx={{ mb: 0.5 }} htmlFor={name}>
            {label}
          </FormLabel>
          <FormControl error={!!error} fullWidth>
            <PhoneInput
              {...restField}
              {...restProps}
              defaultCountry="AU"
              className={error ? 'error' : ''}
              readOnly={restProps.readOnly}
              onChange={(value) => {
                restField.onChange(value)
                // @ts-ignore
                onChange && onChange()
              }}
              onBlur={(e) => {
                restField.onBlur()
                // @ts-ignore
                onBlur && onBlur(e)
              }}
              ref={ref}
              placeholder={placeholder || label}
            />
            <FormHelperText>{error ? error?.message : restProps.helperText}</FormHelperText>
          </FormControl>
        </>
      )}
    />
  )
}
