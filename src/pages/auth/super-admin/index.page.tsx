import { Stack } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'

import PasswordInput from '@/components/_ui/passwordInputField/PasswordField.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import StatusDialog from '@/components/_ui/statusDialog/StatusDialog'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { Page } from '@/types/page.type'
import { schema, TSchema } from './superAdminLogin.config'
import { useLoginMutation } from '@/redux/api/auth.api'
import { setUser } from '@/pages/auth/Auth.util'

const SuperAdminLogin: Page = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const [login] = useLoginMutation()

  const onSubmit = async (data: TSchema) => {
    try {
      const result = await login({ email: data.email, password: data.password, isAdmin: false, isSuperAdmin: true }).unwrap()

      if (result.statusCode === 200) {
        setUser(result.result)
        window.location.href = '/super-admin/dashboard'
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message
      setDialogMessage(errorMsg)
      setDialogOpen(true)
    }
  }
  return (
    <AuthLayout title="Login As Super Admin">
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <TextInput name="email" type="email" control={control} label="Email" placeholder="Enter Email Address" />
        <PasswordInput control={control} name="password" label="Password" placeholder="Enter Password" />
        <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
          Login
        </LoadingButton>
      </Stack>
      <StatusDialog open={dialogOpen} title="Login Failed" message={dialogMessage} status="error" onClose={() => setDialogOpen(false)} />
    </AuthLayout>
  )
}

SuperAdminLogin.layoutProps = {
  title: 'Admin | Login',
  header: false,
  sidebar: false,
  footer: false,
  pageType: 'auth',
}

export default SuperAdminLogin
