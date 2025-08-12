import FullPageMessage from '@/components/_ui/fullPageMessage/FullPageMessage.component'
import { Page } from '@/types/page.type'

const ServerError: Page = () => {
  return <FullPageMessage heading="500: Server-side error occurred" />
}

ServerError.layoutProps = {
  title: 'Server-side error occurred',
  pageType: 'public',
  header: false,
  sidebar: false,
  footer: false,
}

export default ServerError
