import WebsiteLoader from '@/components/_ui/websiteLoader/WebsiteLoader.component'
import OrderStatusUI from '@/components/orderStatusUI/OrderStatusUI.component'
import { useOrderStatus } from '@/hooks/useOrderStatus.hook'
import { Page } from '@/types/page.type'

const Cancel: Page = () => {
  const { isLoading } = useOrderStatus()

  if (isLoading) {
    return <WebsiteLoader />
  }

  return <OrderStatusUI imageSrc="/cancel.png" title="Your Order has been cancelled." />
}

Cancel.layoutProps = {
  title: 'Cancel',
  pageType: 'protected',
  header: false,
  sidebar: false,
  footer: false,
  roles: 'customer',
}

export default Cancel
