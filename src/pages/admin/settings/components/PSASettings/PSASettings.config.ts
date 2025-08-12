import * as yup from 'yup'
import { messages } from '@/constants/Messages'
import { isValidMaxDigits } from '@/utils/validation.util'

export const schema = yup.object().shape({
  id: yup.number().notRequired(),
  enable_psa_submissions: yup.boolean(),
  enable_card_cleaning: yup.boolean(),
  enable_dropoff: yup.boolean(),
  enable_shipping: yup.boolean(),
  enableDropOffOrShipping: yup.boolean().test('atLeastOne', 'At least one of Drop Off or Shipping must be enabled', function (_, context) {
    const { enable_dropoff, enable_shipping } = context.parent
    return enable_dropoff || enable_shipping
  }),
  card_cleaning_fees: yup.number().when('$enable_card_cleaning', {
    is: true,
    then: (schema) => schema.required('*Required').test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
    otherwise: (schema) => schema.default(0),
  }),
  services: yup.array().of(
    yup.object().shape({
      id: yup.number().notRequired(),
      name: yup.string().required('*Required').max(50, messages.psaSettings.labelName),
      days: yup
        .number()
        .required('*Required')
        .min(1, messages.psaSettings.minDay)
        .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
      days_label: yup.string().required('*Required').max(50, messages.psaSettings.days_label),
      max_declared_value: yup
        .number()
        .required('*Required')
        .min(1, messages.psaSettings.minCost)
        .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
      cost: yup
        .number()
        .required('*Required')
        .min(1, messages.psaSettings.minCost)
        .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
      minimum_card_req: yup
        .number()
        .required('*Required')
        .min(1, messages.psaSettings.minCard)
        .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
      bulk_discount: yup
        .number()
        .required('*Required')
        .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
      quantity: yup
        .number()
        .required('*Required')
        .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
    }),
  ),
})

export type TSchema = yup.InferType<typeof schema>
