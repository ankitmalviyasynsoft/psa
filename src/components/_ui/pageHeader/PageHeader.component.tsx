import React from 'react'
import { Stack, Typography } from '@mui/material'
import { HeaderProps } from './PageHeader.type'
import { style } from './PageHeader.style'

export default function PageHeader(props: HeaderProps) {
  const { title, action } = props

  return (
    <Stack component="div" sx={style.root}>
      <Typography variant="h4">{title}</Typography>
      {action}
    </Stack>
  )
}
