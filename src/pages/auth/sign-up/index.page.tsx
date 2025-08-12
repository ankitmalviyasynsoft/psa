import Image from 'next/image'
import { Container, Stack, Typography } from '@mui/material'

import Logo from '@/../public/logo.svg'
import BGImage from '@/../public/bg.jpg'
import { Page } from '@/types/page.type'
import { RegisterForm } from '../component/registerForm/RegisterForm.component'
import { style } from './Register.style'

const Register: Page = () => {
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
              <Typography variant="h5">Sign Up</Typography>
            </Stack>
            <RegisterForm />
          </Stack>
        </Container>
      </Stack>
    </>
  )
}

Register.layoutProps = {
  title: 'Sign Up',
  header: false,
  sidebar: false,
  footer: false,
  pageType: 'auth',
}

export default Register
