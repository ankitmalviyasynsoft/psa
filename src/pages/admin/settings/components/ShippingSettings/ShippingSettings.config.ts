import { messages } from '@/constants/Messages'
import * as yup from 'yup'

export const schema = yup.object({
  result: yup.array().of(
    yup.object({
      shipping_key: yup.string().required(),
      shipping_label: yup.string(),
      settings: yup.object({
        shipping_method: yup
          .array()
          .when('shipping_key', {
            is: 'aus_post',
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.optional(),
          })
          .of(yup.string().oneOf(['express', 'regular']))
          .min(1, messages.shippingSettings.atLeastOneShipping),
      }),
      cost: yup
        .number()
        .typeError('Cost must be a number')
        .required('*Required')
        .when('shipping_key', {
          is: 'flat_rate',
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.optional(),
        }),
      api_key: yup
        .string()
        .required(messages.shippingSettings.atLeastOneShipping)
        .when('shipping_key', {
          is: 'aus_post',
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.optional(),
        }),
      dev_mode: yup.boolean().required(),
    }),
  ),
})

export type TSchema = yup.InferType<typeof schema>
