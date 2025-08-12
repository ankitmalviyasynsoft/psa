import Image from 'next/image'
import { Stack, Typography } from '@mui/material'

import { style } from './emptyCard.style'
import EmptyState from '@/../public/empty_state/No_Files.svg'

const EmptyCard = () => {
  return (
    <Stack sx={style.emptyCardStyle}>
      <Image src={EmptyState} alt="empty state" />
      <Typography variant="subtitle1">No Data Found</Typography>
    </Stack>
  )
}

export default EmptyCard
