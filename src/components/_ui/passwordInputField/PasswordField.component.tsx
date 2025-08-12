import React, { useState } from 'react'
import { IconButton, TextField, FormControl, FormLabel } from '@mui/material'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { PasswordFieldProps } from './PasswordField.type'

export default function PasswordInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: PasswordFieldProps<TFieldValues, TName> & { placeholder: string }) {
  const { control, name, onChange, onBlur, label, placeholder, error, ...restProps } = props
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel sx={{ mb: 0.5 }} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ fieldState: { error: fieldError }, field }) => {
          const { ref, value, ...restField } = field

          return (
            <TextField
              {...restField}
              {...restProps}
              value={value ?? ''}
              inputRef={ref}
              error={!!(fieldError || error)}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              onBlur={(e) => {
                restField.onBlur()
                onBlur && onBlur(e)
              }}
              onChange={(e) => {
                const newValue = e.target.value
                onChange ? onChange(e, field, newValue) : restField.onChange(newValue)
              }}
              helperText={fieldError ? fieldError.message : restProps.helperText}
              FormHelperTextProps={{ sx: { ml: 0 } }}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </IconButton>
                  ),
                  autoComplete: 'new-password',
                },
              }}
            />
          )
        }}
      />
    </FormControl>
  )
}
