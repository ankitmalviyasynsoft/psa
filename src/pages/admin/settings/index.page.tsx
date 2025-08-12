import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, { useState } from 'react'
import { Fade, Stack, Tab } from '@mui/material'
import { useRouter } from 'next/router'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import { style } from './Settings.style'
import { Page } from '@/types/page.type'
import { TABS } from './Settings.config'
import { TTabId } from './Settings.type'
import { useUrlParams } from '@/hooks/useUrlParams.hook'

const Settings: Page = () => {
  const router = useRouter()
  const { setUrlParams } = useUrlParams()

  const selectedTab: TTabId = (router.query.tab as TTabId) || 'general-settings'

  const handleTabChange = (value: TTabId) => {
    setUrlParams({ key: 'tab', value, options: { shallow: true, scroll: true } })
  }

  return (
    <Stack sx={style.root}>
      <PageHeader title="Settings" />
      <Stack sx={style.cardStyle}>
        {/* Tab Headings */}
        <TabContext value={selectedTab}>
          <TabList onChange={(_, value) => handleTabChange(value)}>
            {TABS.map((item, index) => (
              <Tab iconPosition="start" label={item.label} value={item.id} sx={style.tab} icon={item.Icon && <item.Icon />} key={index} />
            ))}
          </TabList>

          {/* Tab Content */}
          {TABS.map((item, index) => (
            <React.Fragment key={index}>
              <Fade in key={selectedTab} timeout={300}>
                <TabPanel value={item.id}>{item.content}</TabPanel>
              </Fade>
            </React.Fragment>
          ))}
        </TabContext>
      </Stack>
    </Stack>
  )
}

export default Settings

Settings.layoutProps = {
  title: 'Settings',
  pageType: 'protected',
  roles: 'admin',
}
