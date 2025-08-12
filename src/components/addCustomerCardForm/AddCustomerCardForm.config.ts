import * as yup from 'yup'
import { messages } from '@/constants/Messages'
import { isValidMaxDigits } from '@/utils/validation.util'

export const schema = yup.object().shape({
  title: yup.string().trim().required(messages.cardTitle).max(150, messages.cardTitleMax),
  game_title: yup.string().trim().required(messages.gameTitle).max(50, messages.gameTitleMax),
  number: yup.string().trim().required(messages.cardNumber).max(15, messages.cardNumberMax),
  expansion: yup.string().trim().required(messages.expansionName).max(150, messages.expansionNameMax),
  year: yup.number().typeError('Year must be a number').required(messages.year).min(1000, messages.validYear).max(9999, messages.validYear),
  declared_value: yup
    .number()
    .typeError('Declared value must be a number')
    .required('Please enter Declared Value.')
    .positive('Declared value must be greater than 0')
    .test('maxDigits', messages.maxDigit, (value) => isValidMaxDigits(value, 10)),
})

export type TSchema = yup.InferType<typeof schema>
