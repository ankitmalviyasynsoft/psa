import { Roles } from '@/types/Roles.type'
import { Store } from './Store.dto'

export type UserDetails = {
  id: number
  userId: number
  company_name: string | null
  ABN_number: string | null
  address_1: string
  address_2: string
  city: string
  state: string
  zip_code: string
  enable_shipping_address: boolean
  shipping_address_1: string
  shipping_address_2: string
  shipping_city: string
  shipping_state: string
  shipping_zip_code: string
  createdAt: string
  updatedAt: string
}

export type UserProfile = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  userDetails: UserDetails
  store?: Store | null
  roleId: number
  roleName: Roles
}
