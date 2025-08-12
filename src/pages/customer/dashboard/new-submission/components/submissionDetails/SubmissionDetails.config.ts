import * as yup from 'yup'
import { messages } from '@/constants/Messages'
import { isValidMaxDigits } from '@/utils/validation.util'

export const schema = yup.object().shape({
  submissionlevel: yup.string().required(),
  etm: yup.string().required(),
  max_declared_value: yup.number().required(),
  cards: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().nullable(),
        uid: yup.number().nullable(),
        card_name: yup.string().required('*Required'),
        image_link: yup.string().nullable(),
        declared_value: yup
          .number()
          .required('*Required')
          .moreThan(0, 'Declared value must be greater than 0')
          .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10))
          .lessThan(yup.ref('$maxDeclaredValue'), 'Declared value must be less than the maximum allowed (${less})'),
      }),
    )
    .min(yup.ref('$minimumOrderQuantity'), ({ min }) => `You must add at least ${min} cards`),
})

export type TSchema = yup.InferType<typeof schema>
