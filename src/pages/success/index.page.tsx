import WebsiteLoader from '@/components/_ui/websiteLoader/WebsiteLoader.component'
import OrderStatusUI from '@/components/orderStatusUI/OrderStatusUI.component'
import { useOrderStatus } from '@/hooks/useOrderStatus.hook'
import { Page } from '@/types/page.type'

const Success: Page = () => {
  const { orderStatus, isLoading } = useOrderStatus()

  if (isLoading) {
    return <WebsiteLoader />
  }

  return (
    <OrderStatusUI
      imageSrc="/ok.png"
      title="Your Order has been placed."
      description="Thank you for your purchase!"
      orderDetails={{
        totalAmount: `${orderStatus?.currency_symbol}  ${orderStatus?.total_amount}`,
        orderId: orderStatus?.orderId,
      }}
    />
  )
}

Success.layoutProps = {
  title: 'Success',
  pageType: 'public',
  header: false,
  sidebar: false,
  footer: false,
}

export default Success
