import * as yup from 'yup'

export const schema = yup.object().shape({
  totalPayment: yup.number().required(),
  orderItems: yup.array().of(
    yup.object().shape({
      card_name: yup.string().required(),
      upcharge_amount: yup.number().required(),
    }),
  ),
})

export type TSchema = yup.InferType<typeof schema>
