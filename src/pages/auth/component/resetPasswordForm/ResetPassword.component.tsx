import { Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'

import PasswordInput from '@/components/_ui/passwordInputField/PasswordField.component'
import { schema, TSchema } from './ResetPassword.config'
import { useVerifyUpdatePasswordMutation } from '@/redux/api/auth.api'

export function ResetPasswordForm() {
  const router = useRouter()
  const [verifyUpdatePassword] = useVerifyUpdatePasswordMutation()
  const { token } = router.query

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: TSchema) => {
    const result = await verifyUpdatePassword({ newPassword: data.newPassword, token }).unwrap()
    if (result.statusCode === 200) {
      router.push('/auth/login')
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
      {/* New Password */}
      <PasswordInput control={control} name="newPassword" label="Enter New Password" placeholder="Enter Password" />

      {/* Confirm Password */}
      <PasswordInput control={control} name="confirmPassword" label="Confirm Password" placeholder="Enter Confirm Password" />

      <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
        Reset Password
      </LoadingButton>
    </Stack>
  )
}
