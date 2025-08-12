import { TSchema } from './CustomerDetails.config'

export const extractCustomerDetails = (obj: any = {}): TSchema => {
  const isFlat = !!obj.address_1 || !!obj.city
  const user = isFlat ? obj : obj?.userDetails || {}

  return {
    firstName: obj.firstName || '',
    lastName: obj.lastName || '',
    email: obj.email || '',
    phone: obj.phone || '',
    userDetails: {
      address_1: user.address_1 || '',
      address_2: user.address_2 || '',
      city: user.city || '',
      state: user.state || '',
      zip_code: user.zip_code || '',
    },
  }
}
