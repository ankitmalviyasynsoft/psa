import * as yup from 'yup'
import { messages } from '@/constants/Messages'

export const schema = yup.object().shape({
  due_amount: yup.number().required(messages.requiredValidAmount),
})

export type TSchema = yup.InferType<typeof schema>
