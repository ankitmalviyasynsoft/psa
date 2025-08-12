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
  card_cleaning: yup.string().required(),
  storeId: yup.number().required(),
  userId: yup.number().required(),
  orderId: yup.number().required(),
  currency_code: yup.string().required(),
  currency_symbol: yup.string().required(),
})

export type TSchema = yup.InferType<typeof schema>
