import Grid from '@mui/material/Grid2'
import React, { useEffect } from 'react'
import { InputLabel, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { MdOutlineContentCopy } from 'react-icons/md'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import SelectOption from '@/components/_ui/selectOption/Select.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { schema, TSchema } from './StoreSetting.config'
import { useGetCurrencyListQuery } from '@/redux/api/currencyList.api'
import { useGetStoreDetailsQuery, useUpdateStoreDetailsMutation } from '@/redux/api/psaSetting.api'
import { handleCopy } from '@/utils/copy.util'

const StoreSettings = () => {
  const currencyListApiState = useGetCurrencyListQuery()
  const storeDetailsApiState = useGetStoreDetailsQuery()
  const [updateStoreDetails] = useUpdateStoreDetailsMutation()

  const storeDetails = storeDetailsApiState.isSuccess && storeDetailsApiState?.data?.result
  const currencyOptions = (currencyListApiState.isSuccess && currencyListApiState.data?.result?.map((currency) => currency.currency_code)) || []

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (storeDetails) {
      reset({
        name: storeDetails.name || '',
        currency_code: storeDetails.currency_code || '',
      })
    }
  }, [storeDetails, reset])

  const onSubmit = async (data: TSchema) => {
    await updateStoreDetails(data).unwrap()
    storeDetailsApiState.refetch()
  }

  return (
    <RenderContent loading={storeDetailsApiState.isLoading || currencyListApiState.isLoading} error={storeDetailsApiState.isError || currencyListApiState.isError}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Store Details
      </Typography>

      {storeDetails && (
        <Typography variant="body1" sx={{ mb: 2 }} display="flex" alignItems="center" gap={1}>
          Store Link:
          <span style={{ color: 'blue', textDecoration: 'underline' }}>{`${process.env.NEXT_PUBLIC_BASE_URL}customer/dashboard/new-submission/${storeDetails.slug}`}</span>
          <MdOutlineContentCopy style={{ cursor: 'pointer' }} onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_BASE_URL}customer/dashboard/new-submission/${storeDetails.slug}`)} />
        </Typography>
      )}

      <Grid container alignItems="center" component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput name="name" control={control} label="Store Name" placeholder="Enter New Store Name" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel>Select Currency</InputLabel>
          <SelectOption name="currency_code" label="Select Currency" options={currencyOptions} control={control} placeholder="Select Currency" />
        </Grid>
        <Grid size={{ xs: 12 }} display="flex" justifyContent="center" alignItems="center">
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Grid>
      </Grid>
    </RenderContent>
  )
}

export default StoreSettings
