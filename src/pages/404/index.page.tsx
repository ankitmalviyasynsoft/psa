import Link from 'next/link'
import { Button } from '@mui/material'

import FullPageMessage from '@/components/_ui/fullPageMessage/FullPageMessage.component'
import { Page } from '@/types/page.type'

const PageNotFound: Page = () => {
  return (
    <FullPageMessage
      heading="404: Page Not Found"
      ActionButton={
        <Button variant="contained" href="/" component={Link}>
          Go to Home
        </Button>
      }
    />
  )
}

PageNotFound.layoutProps = {
  title: 'Page not found',
  pageType: 'public',
  header: false,
  sidebar: false,
  footer: false,
}

export default PageNotFound
