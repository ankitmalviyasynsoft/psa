import { messages } from '@/constants/Messages'
import * as yup from 'yup'

export const schema = yup.object({
  title: yup.string().trim().required(messages.cardTitle).max(150, messages.cardTitleMax),
  game_title: yup.string().trim().required(messages.gameTitle).max(50, messages.gameTitleMax),
  number: yup.string().trim().required(messages.cardNumber).max(15, messages.cardNumberMax),
  expansion: yup.string().trim().required(messages.expansionName).max(150, messages.expansionNameMax),
  rarity: yup.string().trim().required(messages.rarityName).max(50, messages.rarityNameMax),
  abbreviation: yup.string().trim().required(messages.abbreviation).max(50, messages.abbreviationMax),
  year: yup.number().typeError('Year must be a number').required(messages.year).min(1000, messages.validYear).max(9999, messages.validYear),
})

export type TSchema = yup.InferType<typeof schema>
