import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import Address from '@/components/GeneralSettings/Address'
import Profile from '@/components/GeneralSettings/Profile'
import { UpdatePassword } from '@/components/updatePassword/UpdatePassword.component'
import { style } from './MyProfile.style'
import { schema, TSchema } from './MyProfile.config'
import { useUpdateProfileCustomerMutation } from '@/redux/api/user.api'
import { useReduxSelector } from '@/hooks'
import { Page } from '@/types/page.type'

const MyProfile: Page = () => {
  const profile = useReduxSelector((state) => state.profile.profile)
  const [updateProfileCustomer] = useUpdateProfileCustomerMutation()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: { ...profile },
  })

  const onSubmit = async (data: TSchema) => {
    await updateProfileCustomer(data as any).unwrap()
  }

  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false)

  return (
    <>
      <Stack>
        <PageHeader title="My Profile" />
        <Stack sx={style.cardStyle}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="h6">Contact Details</Typography>
            <Button size="small" variant="contained" onClick={() => setIsUpdatePasswordOpen(true)}>
              Update Password
            </Button>
          </Stack>

          <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Profile control={control} errors={errors} isEmailDisabled={true} />
            </Grid>
            <Grid container spacing={2}>
              <Address control={control} errors={errors} show={true} trigger={trigger} setValue={setValue} getValues={getValues} />
            </Grid>
            <Grid container justifyContent="center" display="flex" alignItems="center">
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                Update
              </LoadingButton>
            </Grid>
          </Stack>
        </Stack>
      </Stack>

      {/* Update Password  modal */}
      {isUpdatePasswordOpen && <UpdatePassword onClose={() => setIsUpdatePasswordOpen(false)} />}
    </>
  )
}

export default MyProfile

MyProfile.layoutProps = {
  title: 'Profile',
  pageType: 'protected',
  roles: 'customer',
}
