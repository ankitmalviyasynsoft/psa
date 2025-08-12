import React from 'react'
import { Stack, Typography } from '@mui/material'
import { SummaryCardProps } from './SummaryCard.type'
import { style } from './SummaryCard.style'

export default function SummaryCard(props: SummaryCardProps) {
  const { title, data } = props

  return (
    <Stack component="div" sx={style.cardStyle}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="h1">{data}</Typography>
    </Stack>
  )
}
