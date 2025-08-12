import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, SelectChangeEvent } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { style } from './Select.style'

interface SelectOptionProps {
  name: string
  label?: string
  options: string[]
  control?: Control<any>
  disabled?: boolean
  inputProps?: any
  onChange?: (event: SelectChangeEvent<string>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  defaultValue?: any
  placeholder?: string
}

const SelectOption: React.FC<SelectOptionProps> = ({ name, label, options, control, disabled, onBlur, onChange, defaultValue, placeholder }) => {
  return (
    <FormControl fullWidth disabled={disabled} sx={style.root}>
      <InputLabel htmlFor={name}></InputLabel>

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ''}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              <Select
                displayEmpty
                {...field}
                value={field.value || ''}
                onBlur={(event) => {
                  field.onBlur()
                  onBlur && onBlur(event)
                }}
                onChange={(event) => {
                  field.onChange(event)
                  if (onChange) {
                    onChange(event)
                  }
                }}
                renderValue={(selected) => {
                  if (!selected && placeholder) {
                    return <span>{placeholder}</span>
                  }
                  return selected
                }}
                error={!!error}
                sx={{
                  height: '48px',
                  '&.MuiOutlinedInput-root': {
                    '& fieldset': {
                      top: 0,
                    },
                    '& .MuiSelect-select': {
                      paddingTop: '12px',
                      paddingBottom: '12px',
                    },
                    '& .MuiOutlinedInput-notchedOutline legend': {
                      display: 'none',
                    },
                  },
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value="">
                  <span>{placeholder}</span>
                </MenuItem>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText sx={{ ml: 0 }}>{error.message}</FormHelperText>}
            </>
          )
        }}
      />
    </FormControl>
  )
}

export default SelectOption
