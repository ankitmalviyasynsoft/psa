import Image from 'next/image'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { BiMenu } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'
import { Avatar, Box, Button, Divider, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'

import Logo from '@/../public/logo.svg'
import { style } from './Header.style'
import { handleLogout } from '@/redux/slice/auth.slice'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { HeaderProps } from './Header.type'
import { setCookie } from '@/utils/cookie.util'

export default function Header({ toggleDrawer }: HeaderProps) {
  const dispatch = useReduxDispatch()
  const profile = useReduxSelector((state) => state.profile.profile)
  const firstLetter = profile?.firstName ? profile.firstName.charAt(0) : 'D'

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSwitchBack = () => {
    const originalToken = localStorage.getItem('impersonatedToken')
    if (originalToken) {
      setCookie('token', originalToken, 30)
      localStorage.removeItem('impersonatedToken')
      window.location.href = '/super-admin/dashboard'
    }
  }

  return (
    <>
      <Stack sx={style.root}>
        <IconButton edge="start" onClick={toggleDrawer} sx={{ mr: 2, fontSize: 24, color: 'white', display: { sm: 'none' } }}>
          <BiMenu />
        </IconButton>
        <Box>
          <Stack sx={style.Logo}>
            <Link href="/" passHref>
              <Image src={Logo} alt="logo" style={{ cursor: 'pointer' }} />
            </Link>
          </Stack>
        </Box>
        {localStorage.getItem('impersonatedToken') && (
          <Button variant="contained" color="error" onClick={handleSwitchBack}>
            Back to Super Admin
          </Button>
        )}

        <Tooltip title="Account settings">
          <IconButton onClick={handleClick}>
            {profile?.store?.name && (
              <Typography variant="h6" color="#FFFFFF" sx={{ mr: 1 }}>
                {profile?.store?.name}
              </Typography>
            )}
            <Avatar sx={{ width: 32, height: 32 }}>{firstLetter}</Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Typography variant="subtitle1" p={1.5}>
            {profile?.firstName} {profile?.lastName}
          </Typography>
          <Divider />
          <MenuItem onClick={() => dispatch(handleLogout())}>
            <ListItemIcon>
              <FiLogOut size={24} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Stack>
    </>
  )
}
