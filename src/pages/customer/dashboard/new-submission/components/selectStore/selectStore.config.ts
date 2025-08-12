import { messages } from '@/constants/Messages'
import * as yup from 'yup'

export const schema = yup.object().shape({
  storeName: yup.string().required(messages.selectStoreName),
})

export type TSchema = yup.InferType<typeof schema>
