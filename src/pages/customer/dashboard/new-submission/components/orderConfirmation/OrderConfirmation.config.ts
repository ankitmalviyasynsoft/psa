import * as yup from 'yup'

export const schema = yup.object().shape({
  shipping: yup.string().required(),
  shippingMethod: yup.string(),
  shippingCost: yup.number().required(),
  submissionLevel: yup.string().required(),
  numberOfCards: yup.number().required(),
  costPerCard: yup.number().required(),
  totalCost: yup.number().required(),
  discountpercard: yup.number().required(),
  minQuantityDiscount: yup.number().required(),
  totalDiscount: yup.number().required(),
  costPerCardForCleaning: yup.number().required(),
  totalCostForCleaning: yup.number().required(),
  totalPayment: yup.number().required(),
  sub_total: yup.number().required(),
})

export type TSchema = yup.InferType<typeof schema>
