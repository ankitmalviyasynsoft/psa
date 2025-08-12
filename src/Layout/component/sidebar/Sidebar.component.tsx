import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/router'
import { Box, Divider, Drawer, List, ListItem, ListItemButton, Stack, Typography } from '@mui/material'
import { FiFolderPlus, FiSettings, FiUser, FiFeather } from 'react-icons/fi'
import { MdCreditCard } from 'react-icons/md'

import Logo from '@/../public/logo.svg'
import { style } from './Sidebar.style'
import { useReduxSelector } from '@/hooks'

const drawerWidth = 280

const rolePrefixMap: Record<string, string> = {
  customer: '/customer',
  admin: '/admin',
  superAdmin: '/super-admin',
}

const menuItems = [
  { title: 'Submission', icon: <FiFolderPlus size={24} />, path: '/dashboard', roleName: 'customer' },
  { title: 'My Profile', icon: <FiUser size={24} />, path: '/my-profile', roleName: 'customer' },
  // { title: 'Purchased Cards', icon: <MdCreditCard size={24} />, path: '/purchased-cards', roleName: 'customer' },
  // { title: 'My Graded Cards', icon: <MdCreditCard size={24} />, path: '/my-graded-cards', roleName: 'customer' },
  { title: 'Settings', icon: <FiSettings size={24} />, path: '/settings', roleName: 'admin' },
  { title: 'PSA Submissions', path: '/psa-submissions', roleName: 'admin' },
  { title: 'PSA Customer Submissions', path: '/psa-customer-submissions', roleName: 'admin' },
  { title: 'Awaiting Submissions', path: '/awaiting-submissions', roleName: 'admin' },
  { title: 'PSA Customer Unpaid Submissions', path: '/psa-unpaid-customer-submissions', roleName: 'admin' },
  // { title: 'Buy Cards', icon: <MdCreditCard size={24} />, path: '/cards-on-sell', roleName: 'admin' },
  // { title: 'Purchased Cards', icon: <MdCreditCard size={24} />, path: '/cards-bought', roleName: 'admin' },
  { title: 'Dashboard', path: '/dashboard', roleName: 'superAdmin' },
  { title: 'Store List', path: '/store-list', roleName: 'superAdmin' },
  { title: 'Customer List', path: '/customer-list', roleName: 'superAdmin' },
  { title: 'Unapproved Retailer', path: '/unapproved-retailer', roleName: 'superAdmin' },
  { title: 'Export CSV', path: '/export-csv', roleName: 'superAdmin' },
  { title: 'Upload Cards', path: '/upload-cards', roleName: 'superAdmin' },
  { title: 'Card List', path: '/card-list', roleName: 'superAdmin' },

  // { title: 'Theme Guide', icon: <FiFeather size={24} />, path: '/theme-guide' },
]

export default function SidebarDrawer({ mobileOpen, setMobileOpen, setIsClosing, window }: any) {
  const router = useRouter()
  const { role } = useReduxSelector((state) => state.profile)

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleMenuItemClick = () => {
    if (mobileOpen) {
      setMobileOpen(false)
    }
  }

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roleName) {
      return item.roleName === role
    }
    return true
  })

  const drawer = (
    <Stack>
      <Stack sx={style.Logo}>
        <Link href="/" passHref>
          <Image src={Logo} alt="logo" priority width={200} height={64} style={{ cursor: 'pointer', width: '100%', height: 'auto', marginTop: '5px' }} />
        </Link>
      </Stack>
      <Divider />
      <List>
        {filteredMenuItems.map((item, index) => {
          const prefix = item.roleName ? rolePrefixMap[item.roleName] : ''
          const fullPath = `${prefix}${item.path}`
          const isActive = router.pathname === fullPath || router.pathname.startsWith(`${fullPath}/`)

          return (
            <ListItem key={index}>
              <ListItemButton
                sx={{
                  gap: 1.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'inherit',
                  color: isActive ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'inherit',
                  },
                }}
                component={Link as any}
                href={fullPath}
                onClick={handleMenuItemClick}
              >
                {item.icon && item.icon}
                <Typography variant="subtitle1">{item.title}</Typography>
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Stack>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: false }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawer}
      </Drawer>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderColor: '#f5f5f5' } }} open>
        {drawer}
      </Drawer>
    </Box>
  )
}
