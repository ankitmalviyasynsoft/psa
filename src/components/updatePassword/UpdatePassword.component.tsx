import React from 'react'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'

import PasswordInput from '@/components/_ui/passwordInputField/PasswordField.component'
import { schema, TSchema } from './updatePassword.config'
import { useUpdatePasswordMutation } from '@/redux/api/user.api'

interface UpdatePasswordProps {
  onClose: () => void
}

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onClose }) => {
  const [updatePassword] = useUpdatePasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: TSchema) => {
    await updatePassword({ password: data.newPassword, isPasswordUpdate: true }).unwrap()
    onClose()
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Password</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <PasswordInput control={control} name="newPassword" label="Enter New Password" placeholder="Enter Password" />
          <PasswordInput control={control} name="confirmPassword" label="Confirm Password" placeholder="Enter Confirm Password" />
          <DialogActions>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              Update
            </LoadingButton>
            <Button size="small" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default UpdatePassword
