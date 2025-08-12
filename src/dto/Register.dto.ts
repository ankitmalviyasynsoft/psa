export type RegisterDTO = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  storeName?: string | null
  isAdmin: boolean
}
