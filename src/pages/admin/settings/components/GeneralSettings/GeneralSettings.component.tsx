import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'

import Profile from '@/components/GeneralSettings/Profile'
import Address from '@/components/GeneralSettings/Address'
import UpdatePassword from '@/components/updatePassword/UpdatePassword.component'
import { useReduxSelector } from '@/hooks'
import { schema, TSchema } from './GeneralSetting.config'
import { useUpdateProfileAdminMutation } from '@/redux/api/user.api'

const GeneralSettings = () => {
  const profile = useReduxSelector((state) => state.profile.profile)
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false)
  const [updateProfileAdmin] = useUpdateProfileAdminMutation()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      userDetails: {
        ABN_number: profile.userDetails?.ABN_number || '',
        company_name: profile.userDetails?.company_name || '',
        address_1: profile.userDetails?.address_1 || '',
        address_2: profile.userDetails?.address_2 || '',
        state: profile.userDetails?.state || '',
        city: profile.userDetails?.city || '',
        zip_code: profile.userDetails?.zip_code || '',
        shipping_address_1: profile.userDetails?.shipping_address_1 || '',
        shipping_address_2: profile.userDetails?.shipping_address_2 || '',
        shipping_city: profile.userDetails?.shipping_city || '',
        shipping_state: profile.userDetails?.shipping_state || '',
        shipping_zip_code: profile.userDetails?.shipping_zip_code || '',
        enable_shipping_address: profile.userDetails?.enable_shipping_address || false,
      },
    },
  })

  const onSubmit = async (data: TSchema) => {
    await updateProfileAdmin(data as any).unwrap()
  }

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography sx={{ mb: 2 }} variant="h6">
          Submitter Details
        </Typography>
        <Button size="small" variant="contained" onClick={() => setIsUpdatePasswordOpen(true)}>
          Update Password
        </Button>
      </Stack>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Profile Form */}
          <Profile control={control} errors={errors} show={true} isEmailDisabled={true} />

          {/*Address Form*/}
          <Address control={control} errors={errors} trigger={trigger} show={true} setValue={setValue} getValues={getValues} />
        </Grid>
        <Grid container justifyContent="center" display="flex" alignItems="center">
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Grid>
      </Stack>

      {/* Update Password Modal */}
      {isUpdatePasswordOpen && <UpdatePassword onClose={() => setIsUpdatePasswordOpen(false)} />}
    </>
  )
}

export default GeneralSettings
