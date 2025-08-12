import ReactPhoneNumberInput from 'react-phone-number-input'
import { styled } from '@mui/material'
import 'react-phone-number-input/style.css'

export const PhoneInput = styled(ReactPhoneNumberInput)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid rgba(0, 0, 0, 0.23)`,
  borderRadius: '6px',
  height: 48,
  padding: '0 10px',
  '--PhoneInputCountrySelect-marginRight': '0',
  '--PhoneInput-color--focus': theme.palette.primary.main,
  '--PhoneInputCountrySelectArrow-color--focus': theme.palette.primary.main,
  '--PhoneInputCountryFlag-borderColor--focus': theme.palette.primary.main,
  '--PhoneInputCountrySelectArrow-width': '0.375rem',
  '&:hover': {
    borderColor: theme.palette.text.primary,
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },
  '&.error': {
    borderColor: theme.palette.error.main,
    '&:focus-within': {
      borderColor: theme.palette.error.main,
      boxShadow: `0 0 0 1px ${theme.palette.error.main}`,
    },
  },
  '.PhoneInputCountry': {
    marginLeft: theme.spacing(1),
  },
  '.PhoneInputInput': {
    border: 'none',
    outline: 'none',
    font: 'inherit',
    width: '100%',
    paddingLeft: theme.spacing(1),
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
  },
}))
