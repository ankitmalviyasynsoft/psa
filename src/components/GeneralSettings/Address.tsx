import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { Checkbox, FormControl, FormControlLabel, FormGroup, SelectChangeEvent, Stack, Typography } from '@mui/material'

import SelectOption from '@/components/_ui/selectOption/Select.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import { stateCity } from '@/constants/State_city'
import { useReduxSelector } from '@/hooks'

interface AddressProps {
  control: Control<FieldValues, any>
  errors: FieldErrors<FieldValues>
  getValues: (name: string) => any
  setValue: (name: string, value: any) => void
  disabled?: boolean
  show?: boolean
}

const Address = ({ control, getValues, setValue, disabled, show, trigger }: any) => {
  const profile = useReduxSelector((state) => state.profile.profile)

  const [enable_shipping_address, setenable_shipping_address] = useState(false)
  const [billingState, setBillingState] = useState('')
  const [shippingState, setShippingState] = useState('')

  useEffect(() => {
    if (profile?.userDetails?.city && profile?.userDetails?.state) {
      setBillingState(profile.userDetails.state)
    }
    if (profile?.userDetails?.shipping_city && profile?.userDetails?.shipping_state) {
      setShippingState(profile.userDetails.shipping_state)
    }
    if (profile?.userDetails?.enable_shipping_address !== undefined) {
      setenable_shipping_address(profile.userDetails.enable_shipping_address)
    }
  }, [profile])

  const handleBillingStateChange = (event: SelectChangeEvent) => {
    setBillingState(event.target.value as string)
  }

  const handleShippingStateChange = (event: SelectChangeEvent) => {
    setShippingState(event.target.value as string)
    setenable_shipping_address(false)
    setValue('userDetails.enable_shipping_address', false)
  }

  const stateNames = stateCity.map((state) => state.name)

  const handleCheckboxChange = () => {
    setenable_shipping_address((prev: boolean) => {
      const newValue = !prev

      setValue('userDetails.enable_shipping_address', newValue)

      if (newValue) {
        setValue('userDetails.shipping_address_1', getValues('userDetails.address_1'), { shouldValidate: true })
        setValue('userDetails.shipping_address_2', getValues('userDetails.address_2'), { shouldValidate: true })
        setValue('userDetails.shipping_city', getValues('userDetails.city'), { shouldValidate: true })
        setValue('userDetails.shipping_state', getValues('userDetails.state'), { shouldValidate: true })
        setValue('userDetails.shipping_zip_code', getValues('userDetails.zip_code'), { shouldValidate: true })

        setShippingState(billingState)

        trigger(['userDetails.shipping_address_1', 'userDetails.shipping_address_2', 'userDetails.shipping_city', 'userDetails.shipping_state', 'userDetails.shipping_zip_code'])
      } else {
        setValue('userDetails.shipping_address_1', '')
        setValue('userDetails.shipping_address_2', '')
        setValue('userDetails.shipping_city', '')
        setValue('userDetails.shipping_state', '')
        setValue('userDetails.shipping_zip_code', '')

        setShippingState('')
      }

      return newValue
    })
  }

  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6">Billing Address</Typography>
      </Grid>

      {/* Address 1 */}
      <Grid size={{ xs: 12 }}>
        <TextInput name="userDetails.address_1" control={control} label="Address" placeholder="Address Line 1" disabled={disabled} />
      </Grid>

      {/* Address 2 */}
      <Grid size={{ xs: 12 }}>
        <TextInput name="userDetails.address_2" control={control} placeholder="Address Line 2" disabled={disabled} />
      </Grid>

      {/* State */}
      <Grid size={{ xs: 12, md: 4 }}>
        <SelectOption name="userDetails.state" label="Select State" options={stateNames} control={control} onChange={handleBillingStateChange} placeholder="Select State" disabled={disabled} />
      </Grid>

      {/* Suburb  */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextInput name="userDetails.city" control={control} placeholder="Suburb" disabled={disabled} />
      </Grid>

      {/* Zipcode  */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextInput name="userDetails.zip_code" control={control} placeholder="Zipcode" disabled={disabled} />
      </Grid>

      {show && (
        <>
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6">Shipping Address</Typography>
                <FormControl>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={enable_shipping_address} onChange={handleCheckboxChange} />} label="Billing & Shipping address are the same?" />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Stack>
          </Grid>

          {/* Shipping Address 1 */}
          <Grid size={{ xs: 12 }}>
            <TextInput name="userDetails.shipping_address_1" control={control} label="Address" placeholder="Address Line 1" />
          </Grid>

          {/* Shipping Address 2 */}
          <Grid size={{ xs: 12 }}>
            <TextInput name="userDetails.shipping_address_2" control={control} placeholder="Address Line 2" />
          </Grid>

          {/*Shipping State */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SelectOption name="userDetails.shipping_state" label="Select State" options={stateNames} control={control} placeholder="Select State" onChange={handleShippingStateChange} />
          </Grid>

          {/*Shipping Suburb  */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextInput name="userDetails.shipping_city" control={control} placeholder="Suburb" />
          </Grid>

          {/*Shipping Zipcode  */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextInput name="userDetails.shipping_zip_code" control={control} placeholder="Zipcode" />
          </Grid>
        </>
      )}
    </>
  )
}

export default Address
