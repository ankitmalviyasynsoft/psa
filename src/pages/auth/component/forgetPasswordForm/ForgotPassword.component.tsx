import Link from 'next/link'
import { Stack, Typography, Link as MuiLink } from '@mui/material'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import { paths } from '@/path'
import { schema, TSchema } from './forgotPassword.config'
import { useForgotPasswordMutation } from '@/redux/api/auth.api'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [forgotPassword] = useForgotPasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: TSchema) => {
    const result = await forgotPassword(data).unwrap()

    if (result.statusCode === 200) {
      router.push('/auth/login')
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
      <TextInput name="email" control={control} label="Email" type="email" placeholder="Please Enter Your Email" />
      <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
        Send Recovery Email
      </LoadingButton>
      <Typography textAlign="center">
        <MuiLink component={Link} href={paths.auth.signIn}>
          Back To Login
        </MuiLink>
      </Typography>
    </Stack>
  )
}
