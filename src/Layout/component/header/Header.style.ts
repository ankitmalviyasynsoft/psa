import { Style } from '@/types'

export const style: Style = {
  root: {
    flexDirection: 'row',
    position: 'sticky',
    top: 0,
    bgcolor: 'primary.main',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 2,
    zIndex: (theme) => theme.zIndex.appBar,
  },
  Logo: {
    display: { xs: 'flex', sm: 'none' },
  },
  Menu: {
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
}
