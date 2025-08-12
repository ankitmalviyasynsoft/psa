import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Box, Button, Stack, Typography, Autocomplete, TextField, Checkbox, FormControlLabel } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'

import Profile from '@/components/GeneralSettings/Profile'
import Address from '@/components/GeneralSettings/Address'
import { schema, TSchema } from './customerForm.config'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { useCreateUserOnBehalfMutation, useGetCustomerListQuery, useLazyGetCustomerDetailsByIdQuery } from '@/redux/api/getCustomerList.api'
import { setOrderAsRetailor, setSelectedCustomer } from '@/redux/slice/customerProfile.slice'
import { createNewSubmission } from '@/redux/slice/newSubmission.slice'
import { setStoreData } from '@/redux/slice/selectedStore'

function CustomerForm({ handleBack, handleNext, steps, activeStep, showButton }: any) {
  const dispatch = useReduxDispatch()
  const [createUser] = useCreateUserOnBehalfMutation()
  const [getCustomerDetailsById] = useLazyGetCustomerDetailsByIdQuery()
  const selectedCustomer = useReduxSelector((state) => state.customerProfile.selectedCustomer)
  const orderAsRetailer = useReduxSelector((state) => state.customerProfile.orderAsRetailor)
  const order = useReduxSelector((state: any) => state.newSubmission.order)
  const profile = useReduxSelector((state: any) => state.profile.profile)

  const [searchValue, setSearchValue] = useState('')
  const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(false)

  const { data: getCustomerList } = useGetCustomerListQuery({ searchVal: searchValue, page: 1, limit: 10 })

  const initialValues = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userDetails: {
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      zip_code: '',
    },
  }

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (order?.orderCustomer) {
      reset({
        ...order.orderCustomer,
        userDetails: {
          address_1: order.orderCustomer.userDetails?.address_1 || '',
          address_2: order.orderCustomer.userDetails?.address_2 || '',
          city: order.orderCustomer.userDetails?.city || '',
          state: order.orderCustomer.userDetails?.state || '',
          zip_code: order.orderCustomer.userDetails?.zip_code || '',
        },
      })
      setIsEmailDisabled(true)
    }
  }, [])

  useEffect(() => {
    const storeData = localStorage.getItem('storeData')
    if (storeData) {
      const parsedStoreData = JSON.parse(storeData)
      dispatch(setStoreData(parsedStoreData))
    }
  }, [])

  useEffect(() => {
    setIsEmailDisabled(!!selectedCustomer || orderAsRetailer)
  }, [selectedCustomer, orderAsRetailer])

  const handleInputChange = (event: any, newValue: string) => {
    setSearchValue(newValue)
  }

  const handleCustomerChange = async (event: any, newValue: any) => {
    if (newValue?.id) {
      const response = await getCustomerDetailsById(newValue.id).unwrap()
      const result = response.result

      reset({
        id: result.id || null,
        firstName: result.firstName || '',
        lastName: result.lastName || '',
        email: result.email || '',
        phone: result.phone || '',
        userDetails: {
          address_1: result.userDetails?.address_1 || '',
          address_2: result.userDetails?.address_2 || '',
          city: result.userDetails?.city || '',
          state: result.userDetails?.state || '',
          zip_code: result.userDetails?.zip_code || '',
        },
      })
    }
    dispatch(setSelectedCustomer(newValue))
  }

  const handleRetailerToggle = (checked: boolean) => {
    dispatch(setOrderAsRetailor(checked))

    if (checked && profile) {
      reset({
        ...profile,
        userDetails: {
          address_1: profile.userDetails?.address_1 || '',
          address_2: profile.userDetails?.address_2 || '',
          city: profile.userDetails?.city || '',
          state: profile.userDetails?.state || '',
          zip_code: profile.userDetails?.zip_code || '',
        },
      })
    } else if (!selectedCustomer) {
      reset({})
    }
  }

  const onSubmit = async (data: TSchema) => {
    const formData = getValues()
    if (selectedCustomer || orderAsRetailer) {
      dispatch(createNewSubmission({ ...order, orderCustomer: formData }))
      handleNext()
    } else {
      const response = await createUser(data)
      if (response?.data?.statusCode === 200) {
        dispatch(createNewSubmission({ ...order, orderCustomer: response.data.result }))
        handleNext()
      }
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6">Customer Details</Typography>
      <Grid container spacing={2}>
        <Grid size={{ md: 6 }}>
          <Autocomplete
            disablePortal
            options={getCustomerList?.result || []}
            getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
            value={selectedCustomer}
            onChange={handleCustomerChange}
            inputValue={searchValue}
            onInputChange={handleInputChange}
            sx={{ width: 400 }}
            renderInput={(params) => <TextField {...params} label="Select Customer" />}
            disabled={orderAsRetailer}
          />
        </Grid>
        <Grid size={{ md: 6 }}>
          <FormControlLabel control={<Checkbox checked={orderAsRetailer} onChange={(e) => handleRetailerToggle(e.target.checked)} disabled={!!selectedCustomer} />} label="Order as Retailer" />{' '}
        </Grid>
        <Grid container spacing={2}>
          <Profile control={control} errors={errors} show={false} isEmailDisabled={isEmailDisabled} />
        </Grid>
        <Grid container spacing={2}>
          <Address control={control} errors={errors} show={false} />
        </Grid>
        {showButton && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button type="submit" variant="contained">
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}

export default CustomerForm
