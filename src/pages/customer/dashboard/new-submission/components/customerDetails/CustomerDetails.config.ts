import * as yup from 'yup'
import { messages } from '@/constants/Messages'

export const schema = yup.object().shape({
  firstName: yup.string().required(messages.firstName).max(50, messages.firstNameMax),
  lastName: yup.string().required(messages.lastName).max(50, messages.lastNameMax),
  // phone: yup.string().matches(/^\+\d{12}$/, messages.validPhone).required(messages.phone),
  phone: yup.string().required(messages.phone).max(15, messages.phoneNumberMax),
  email: yup.string().trim().required(messages.email),
  userDetails: yup.object().shape({
    address_1: yup.string().trim().required(messages.addressLine).max(150, messages.addressLineMax),
    address_2: yup.string().trim().max(150, messages.addressLineMax),
    city: yup.string().trim().required(messages.city).max(50, messages.cityMax),
    state: yup
      .string()
      .required(messages.state)
      .test('state', messages.state, function (value) {
        return value !== ''
      }),
    zip_code: yup.string().trim().required(messages.zipcode).max(15, messages.zipcodeMax),
  }),
})

export type TSchema = yup.InferType<typeof schema>
