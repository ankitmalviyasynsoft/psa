import * as yup from 'yup'
import { messages } from '@/constants/Messages'

export const schema = yup.object().shape({
  name: yup.string().trim().required(messages.storeNameRequired).max(50, messages.storeNameMax),
  currency_code: yup.string().required(),
})

export type TSchema = yup.InferType<typeof schema>
