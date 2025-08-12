type StoreShippingDTO = {
  store_shipping: StoreShippingItem[]
}

type StoreShippingItem = {
  id: number
  enable_shipping: boolean
  api_key: string
  dev_mode: boolean
  shipping_key: string
  shipping_label: string
  settings: ShippingSettings
  cost: number
}

type ShippingSettings =
  | {}
  | {
      shipping_method: string[]
    }

export default StoreShippingDTO
