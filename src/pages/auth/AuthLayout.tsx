import * as React from 'react'
import Image from 'next/image'
import { Container, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

import Logo from '@/../public/logo.svg'
import BGImage from '@/../public/bg.jpg'
import { style } from './AuthLayout.style'

interface AuthLayoutProps {
  title: string
  children: ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <>
      <style global jsx>
        {`
          main {
            display: flex;
            justify-content: center;
            background-image: url('${BGImage.src}');
            background-size: cover;
            background-position: center;
          }
        `}
      </style>
      <Stack component="section">
        <Container>
          <Stack alignItems="center" mb={3} sx={style.Logo}>
            <Image src={Logo} alt="logo" height={64} width={250} />
          </Stack>
          <Stack sx={style.cardStyle}>
            <Stack alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h5">{title}</Typography>
            </Stack>
            {children}
          </Stack>
        </Container>
      </Stack>
    </>
  )
}
