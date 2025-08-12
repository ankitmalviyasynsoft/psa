import Link from 'next/link'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Checkbox, FormControl, Link as MuiLink, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'

import PasswordInput from '@/components/_ui/passwordInputField/PasswordField.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import Address from '@/components/GeneralSettings/Address'
import StatusDialog from '@/components/_ui/statusDialog/StatusDialog'
import { schema, TSchema } from './RegisterForm.config'
import { useRegisterMutation } from '@/redux/api/auth.api'
import { paths } from '@/path'

export function RegisterForm() {
  const [storeNameVisible, setStoreNameVisible] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')

  const [register] = useRegisterMutation()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    context: { storeNameVisible },
  })

  const onSubmit = async (data: TSchema) => {
    const { confirmPassword, ...rest } = data

    const formData = {
      ...rest,
      isAdmin: storeNameVisible,
      storeName: storeNameVisible ? data.storeName : null,
    }

    try {
      const { statusCode, message } = await register(formData).unwrap()

      if (statusCode === 200) {
        setDialogMessage(message || 'Registration successful!')
        setDialogOpen(true)
      }
    } catch (error: any) {
      const message = error?.data?.message || 'Registration failed.'
      setDialogMessage(message)
      setDialogOpen(true)
    }
  }

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* First Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput name="firstName" control={control} label="First Name" placeholder="Enter First Name" />
        </Grid>

        {/* Last Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput name="lastName" control={control} label="Last Name" placeholder="Enter Last Name" />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput name="email" control={control} label="Email" type="email" placeholder="Enter Email Address" />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          {/* <PhoneField name='phone' label='Phone Number' control={control} /> */}
          <TextInput name="phone" control={control} label="Phone Number" placeholder="Enter Phone Number" />
        </Grid>

        {/* Password */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <PasswordInput control={control} name="password" label="Password" placeholder="Enter Password" />
        </Grid>

        {/* Confirm Password */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <PasswordInput control={control} name="confirmPassword" label="Confirm Password" placeholder="Enter Confirm Password" />
        </Grid>

        {/* Store Name */}
        <Address control={control} show={true} errors={errors} trigger={trigger} setValue={setValue} getValues={getValues} />
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={storeNameVisible} onChange={() => setStoreNameVisible(!storeNameVisible)} />} label="Want To Register As A Retailer?" />
            </FormGroup>
          </FormControl>
          {storeNameVisible && <TextInput name="storeName" control={control} label="Enter Store Name" placeholder="Enter Store Name" />}
        </Grid>
      </Grid>
      <Grid container justifyContent="center" display="flex" alignItems="center">
        <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Grid>
      <Typography textAlign="center">
        Already have an account? &nbsp;{' '}
        <MuiLink component={Link} href={paths.auth.signIn}>
          Login
        </MuiLink>
      </Typography>
      <StatusDialog
        open={dialogOpen}
        message={dialogMessage}
        title="Registration Status"
        status={dialogMessage.toLowerCase().includes('success') ? 'success' : 'error'}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          if (dialogMessage.toLowerCase().includes('success')) {
            router.push(paths.auth.signIn)
          }
        }}
      />
    </Stack>
  )
}
