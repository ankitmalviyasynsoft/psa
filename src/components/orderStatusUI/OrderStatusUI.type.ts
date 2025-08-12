export interface OrderStatusUIProps {
  imageSrc: string
  title: string
  description?: string
  orderDetails?: {
    totalAmount?: string
    orderId?: number
  }
}
