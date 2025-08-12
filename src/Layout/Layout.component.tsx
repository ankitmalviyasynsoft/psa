import Head from 'next/head'
import React, { useState } from 'react'
import { Stack } from '@mui/material'

import SidebarDrawer from './component/sidebar/Sidebar.component'
import Header from './component/header/Header.component'
import Footer from './component/footer/Footer.component'
import WebsiteLoader from '@/components/_ui/websiteLoader/WebsiteLoader.component'
import PageNotFound from '@/pages/404/index.page'
import { useAuth } from './Layout.hook'
import { LayoutProps } from './Layout.type'

export default function Layout(props: LayoutProps & { children: React.ReactNode }) {
  let { children, title, header = true, sidebar = true, footer = true } = props
  const { isLoading, isError, isPermission } = useAuth(props)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const renderChildren = () => {
    if (!isPermission) return <PageNotFound heading="404: Page Not Found" hideButton />
    return children
  }

  return (
    <>
      <Head>{title && <title>{`${title} | SlabTrak`}</title>}</Head>

      <Stack direction="row" sx={{ height: '100vh', overflow: 'hidden', width: 1 }}>
        {/* Sidebar component */}
        {isLoading ? (
          <WebsiteLoader />
        ) : (
          <>
            {sidebar && <SidebarDrawer setIsClosing={setIsClosing} setMobileOpen={setMobileOpen} mobileOpen={mobileOpen} />}
            <Stack sx={{ height: 'inherit', overflow: 'auto' }} flex={1}>
              {/* Header component */}
              {header && <Header toggleDrawer={handleDrawerToggle} />}
              {/* Body component */}
              <Stack component="main" flex={1} sx={{ p: 3 }}>
                {renderChildren()}
              </Stack>
              {/* Footer component */}
              {footer && <Footer />}
            </Stack>
          </>
        )}
      </Stack>
    </>
  )
}
