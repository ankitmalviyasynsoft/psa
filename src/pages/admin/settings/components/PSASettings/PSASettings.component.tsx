import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Button, FormControlLabel, Stack, Typography, Switch, CircularProgress, Checkbox } from '@mui/material'

import RenderContent from '@/components/renderContent/RenderContent.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import PSAServiceOfferings from './PSAServiceOfferings/PSAServiceOfferings.component'
import { schema, TSchema } from './PSASettings.config'
import { useGetPsaSettingsQuery, useLazyGetSyncNowQuery, usePsaSettingsSaveMutation } from '@/redux/api/psaSetting.api'
import { useReduxSelector } from '@/hooks'

const PSASettings = () => {
  const [psaSettingsSave] = usePsaSettingsSaveMutation()
  const { data: getPsaSettings, isLoading, refetch, isError } = useGetPsaSettingsQuery()
  const [triggerSync, syncState] = useLazyGetSyncNowQuery()
  const store = useReduxSelector((state) => state?.profile?.profile?.store)
  const currency_symbol = store?.currency_symbol

  const {
    control,
    reset,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })
  const enableDropoff = watch('enable_dropoff')
  const enableShipping = watch('enable_shipping')
  const { fields, append, remove } = useFieldArray({ control, name: 'services' })

  useEffect(() => {
    if (getPsaSettings?.result) {
      reset({
        ...getPsaSettings.result,
        services: getPsaSettings.result.services || [],
      })
    }
  }, [getPsaSettings, reset])

  useEffect(() => {
    trigger('enableDropOffOrShipping')
  }, [enableDropoff, enableShipping, trigger])

  const onSubmit = async (data: any) => {
    const filteredServices = data.services.filter((service: any) => service.name.trim() !== '')

    const formattedData = {
      ...data,
      card_cleaning_fees: data.enable_card_cleaning ? data.card_cleaning_fees : 0,
      services: filteredServices.map((offering: any) => ({
        ...offering,
        psa_settings_id: data.id,
      })),
    }

    await psaSettingsSave(formattedData).unwrap()
    refetch()
  }

  return (
    <RenderContent loading={isLoading} error={isError}>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={1}>
          <Typography variant="h6"> PSA Submission Settings </Typography>
          <Controller
            name="enable_psa_submissions"
            control={control}
            render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value || false} />} label="Toggle on to start accepting PSA Submission" />}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6">Enable Drop Off/Shipping</Typography>
          <Stack direction={{ md: 'column', xs: 'row' }}>
            <Controller name="enable_dropoff" control={control} render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={!!field.value} />} label="Enable Drop Off" />} />
            <Controller name="enable_shipping" control={control} render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={!!field.value} />} label="Enable Shipping" />} />

            {errors.enableDropOffOrShipping && (
              <Typography color="error" variant="caption">
                {errors.enableDropOffOrShipping.message}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={1}>
          <Typography variant="h6"> Sync Now </Typography>
          <Button size="small" variant="contained" onClick={() => triggerSync()} color="error" disabled={syncState.isFetching}>
            {syncState.isLoading || syncState.isFetching ? <CircularProgress size={24} color="inherit" /> : 'Sync Now'}
          </Button>
        </Stack>
        <Typography variant="h6">PSA Service Offerings</Typography>
        <Grid container spacing={1}>
          {fields.map((field, index) => (
            <PSAServiceOfferings key={field.id} index={index} control={control} remove={remove} currency_symbol={currency_symbol} showDelete={index !== 0} />
          ))}

          <Grid size={{ xs: 12 }}>
            <Button size="small" color="error" variant="contained" onClick={() => append({ name: '', days: 0, days_label: '', max_declared_value: 0, cost: 0, minimum_card_req: 0, bulk_discount: 0, quantity: 0 })}>
              Add Item
            </Button>
          </Grid>
        </Grid>
        <Typography variant="h6">Additional Offerings</Typography>

        <Grid container alignItems="center">
          <Typography mr={1} variant="body1">
            Do you offer card cleaning services?
          </Typography>
          <Controller name="enable_card_cleaning" control={control} render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value || false} />} label="" />} />
          {watch('enable_card_cleaning') && (
            <Grid size={{ xs: 12, md: 3 }}>
              <TextInput name="card_cleaning_fees" control={control} placeholder="Enter Fee Amount" type="number" currency_symbol={currency_symbol} />
            </Grid>
          )}
        </Grid>

        <Grid container justifyContent="center" display="flex" alignItems="center">
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Stack>
    </RenderContent>
  )
}

export default PSASettings
