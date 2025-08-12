import Link from 'next/link'
import { useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

import PasswordInput from '@/components/_ui/passwordInputField/PasswordField.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import StatusDialog from '@/components/_ui/statusDialog/StatusDialog'
import { paths } from '@/path'
import { schema, TSchema } from './LoginForm.config'
import { useLoginMutation } from '@/redux/api/auth.api'
import { setUser } from '../../Auth.util'

export function LoginForm() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [login] = useLoginMutation()
  const returnTo = router.query.returnTo as string

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: TSchema) => {
    try {
      const result = await login({ email: data.email, password: data.password, isAdmin, isSuperAdmin: false }).unwrap()

      if (result.statusCode === 200) {
        setUser(result.result)
        if (returnTo) {
          router.push(returnTo)
        } else {
          window.location.href = '/'
        }
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || 'Login failed'
      setDialogMessage(errorMsg)
      setDialogOpen(true)
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
      <TextInput name="email" type="email" control={control} label="Email" placeholder="Enter Email Address" />
      <PasswordInput control={control} name="password" label="Password" placeholder="Enter Password" />
      <Stack>
        <FormControl>
          <FormGroup>
            <FormControlLabel control={<Checkbox onChange={() => setIsAdmin(!isAdmin)} />} label="Login As A Retailer" />
          </FormGroup>
        </FormControl>
        <Typography textAlign="end">
          <MuiLink component={Link} href={paths.auth.forgotPassword}>
            Forgot password?
          </MuiLink>
        </Typography>
      </Stack>
      <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
        Login
      </LoadingButton>
      <Typography textAlign="center">
        Don't have an account? &nbsp;{' '}
        <MuiLink component={Link} href={paths.auth.signUp}>
          Register
        </MuiLink>
      </Typography>
      <StatusDialog open={dialogOpen} title="Login Failed" message={dialogMessage} status="error" onClose={() => setDialogOpen(false)} />
    </Stack>
  )
}
