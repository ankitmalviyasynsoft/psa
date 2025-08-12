import * as yup from 'yup'
import { messages } from '@/constants/Messages'

export const schema = yup.object({
  file: yup.mixed().required('Please select a file'),
})

export type TSchema = yup.InferType<typeof schema>
