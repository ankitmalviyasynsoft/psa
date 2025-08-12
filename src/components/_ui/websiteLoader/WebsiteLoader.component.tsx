import { CircularProgress, Backdrop } from '@mui/material'
import { style } from './WebsiteLoader.style'

export default function WebsiteLoader() {
  return (
    <Backdrop sx={style.root} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
