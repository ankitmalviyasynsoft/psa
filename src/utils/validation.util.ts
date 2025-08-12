import { messages } from '@/constants/Messages'

export const emailTest = () => {
  return {
    name: 'emalValidation',
    test: (value: any) => {
      if (!value) return false

      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      const hasValidEmail = emailRegex.test(value)

      return hasValidEmail
    },
    message: messages.validEmail,
  }
}

export const passwordTest = () => {
  return {
    name: 'passwordValidation',
    test: (value: any) => {
      if (!value) return false

      const hasLowerCase = /[a-z]/.test(value)
      const hasUpperCase = /[A-Z]/.test(value)
      const hasNumber = /[0-9]/.test(value)
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value)
      const isLongEnough = value.length >= 8

      return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && isLongEnough
    },
    message: messages.validPassword,
  }
}

export function isValidMaxDigits(value: number | null | undefined, maxDigits: number): boolean {
  if (value == null) return true
  return String(value).replace('.', '').length <= maxDigits
}
