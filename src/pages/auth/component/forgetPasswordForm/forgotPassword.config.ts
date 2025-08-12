import * as yup from 'yup'
import { emailTest } from '@/utils/validation.util'
import { messages } from '@/constants/Messages'

export const schema = yup.object().shape({
  email: yup.string().trim().required(messages.email).max(150, messages.emailMax).test(emailTest()),
})

export type TSchema = yup.InferType<typeof schema>
