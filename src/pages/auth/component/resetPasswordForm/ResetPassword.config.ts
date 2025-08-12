import { messages } from '@/constants/Messages'
import { passwordTest } from '@/utils/validation.util'
import * as yup from 'yup'

export const schema = yup.object().shape({
  newPassword: yup.string().trim().required(messages.password).max(32, messages.passwordMax).test(passwordTest()),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('newPassword'), ''], messages.passwordMatch)
    .required(messages.password)
    .max(32, messages.passwordMax),
})

export type TSchema = yup.InferType<typeof schema>
