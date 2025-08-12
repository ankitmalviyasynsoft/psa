import * as yup from 'yup'
import { messages } from '@/constants/Messages'

export const schema = yup.object().shape({
  submission_number: yup.number().required(messages.submissionNumber.submissionNumber),
})

export type TSchema = yup.InferType<typeof schema>
