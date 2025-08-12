import * as yup from 'yup'
import { emailTest, passwordTest } from '@/utils/validation.util'
import { messages } from '@/constants/Messages'

export const schema = yup.object().shape({
  firstName: yup.string().required(messages.firstName).max(50, messages.firstNameMax),
  lastName: yup.string().required(messages.lastName).max(50, messages.lastNameMax),
  email: yup.string().trim().required(messages.email).max(50, messages.emailMax).test(emailTest()),
  password: yup.string().trim().required(messages.password).max(32, messages.passwordMax).test(passwordTest()),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], messages.passwordMatch)
    .required(messages.confirmPasswordRequired),
  // phone: yup.string().matches(/^\+\d{12}$/, messages.validPhone).required(messages.phone),
  phone: yup.string().required(messages.phone).max(15, messages.phoneNumberMax),
  userDetails: yup.object().shape({
    address_1: yup.string().trim().required(messages.addressLine).max(150, messages.addressLineMax),
    address_2: yup.string().trim().max(150, messages.addressLineMax).nullable(),
    city: yup.string().trim().required(messages.city).max(50, messages.cityMax),
    state: yup
      .string()
      .required(messages.state)
      .test('state', messages.state, function (value) {
        return value !== ''
      }),
    zip_code: yup.string().trim().required(messages.zipcode).max(15, messages.zipcodeMax),
    shipping_address_1: yup.string().trim().required(messages.addressLine).max(150, messages.addressLineMax),
    shipping_address_2: yup.string().trim().max(150, messages.addressLineMax).nullable(),
    shipping_city: yup.string().trim().required(messages.city).max(50, messages.cityMax),
    shipping_state: yup
      .string()
      .required(messages.state)
      .test('shipping_state', messages.state, function (value) {
        return value !== ''
      }),
    shipping_zip_code: yup.string().trim().required(messages.zipcode).max(15, messages.zipcodeMax),
    enable_shipping_address: yup.boolean(),
  }),
  storeName: yup
    .string()
    .trim()
    .when('$storeNameVisible', {
      is: true,
      then: (schema) => schema.required(messages.storeName).max(50, messages.storeNameMax),
      otherwise: (schema) => schema.optional(),
    }),
})

export type TSchema = yup.InferType<typeof schema>
