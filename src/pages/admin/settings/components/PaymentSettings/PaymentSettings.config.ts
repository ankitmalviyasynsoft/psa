import * as yup from 'yup'

export const schema = yup.object({
  result: yup.array().of(
    yup.object({
      id: yup.number(),
      name: yup.string(),
      key: yup.string(),
      status: yup.boolean(),
      api_key: yup.string(),
      is_dev: yup.boolean(),
      payment_meta: yup.array().of(
        yup.object().shape({
          id: yup.number(),
          key: yup.string(),
          value: yup.string().when('$settingsEnabled', {
            is: true,
            then: (schema) => schema.required('*Required'),
            otherwise: (schema) => schema.notRequired(),
          }),
        }),
      ),
    }),
  ),
})

export type TSchema = yup.InferType<typeof schema>
