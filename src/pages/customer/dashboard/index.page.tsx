import { useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { FiFolderPlus } from 'react-icons/fi'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import PastSubmission from './past-submission/index.page'
import SelectStore from './new-submission/components/selectStore/SelectStore.component'
import { style } from './Dashboard.style'
import { Page } from '@/types/page.type'

const Dashboard: Page = () => {
  const [isSelectStoreOpen, setIsSelectStoreOpen] = useState<boolean>(false)

  return (
    <Stack sx={style.root}>
      {/* page header */}
      <PageHeader
        title="Submissions"
        action={
          <Box>
            <Button size="small" variant="contained" onClick={() => setIsSelectStoreOpen(true)}>
              <FiFolderPlus size={20} style={{ marginRight: 8 }} />
              Create Submission
            </Button>
            {isSelectStoreOpen && <SelectStore onClose={() => setIsSelectStoreOpen(false)} />}
          </Box>
        }
      />
      <PastSubmission />
    </Stack>
  )
}

export default Dashboard
Dashboard.layoutProps = {
  title: 'Dashboard',
  pageType: 'protected',
  roles: 'customer',
}
