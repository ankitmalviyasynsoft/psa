import Grid from '@mui/material/Grid2'

import TextInput from '@/components/_ui/textInputField/TextField.component'

const Profile = ({ control, disabled, show, isEmailDisabled }: any) => {
  return (
    <>
      {/* First Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <TextInput name="firstName" control={control} label="First Name" disabled={disabled} />
      </Grid>

      {/* Last Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <TextInput name="lastName" control={control} label="Last Name" disabled={disabled} />
      </Grid>

      {/* Company Name */}
      {show && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput name="userDetails.company_name" control={control} label="Company Name" />
        </Grid>
      )}

      {/* ABN Number */}
      {show && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput name="userDetails.ABN_number" control={control} label="ABN Number" />
        </Grid>
      )}

      {/* Phone Number */}
      <Grid size={{ xs: 12, md: 6 }}>
        {/* <PhoneField name='phone' label='Phone Number' control={control} readOnly={disabled} /> */}
        <TextInput name="phone" control={control} label="Phone Number" disabled={disabled} />
      </Grid>

      {/* Email */}
      <Grid size={{ xs: 12, md: 6 }}>
        <TextInput name="email" type="email" control={control} label="Email Address" disabled={isEmailDisabled} />
      </Grid>
    </>
  )
}

export default Profile
