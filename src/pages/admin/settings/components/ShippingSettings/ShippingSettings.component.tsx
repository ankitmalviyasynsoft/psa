import Grid from '@mui/material/Grid2'
import React, { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Stack, Typography, FormControlLabel, Checkbox, FormControl, RadioGroup, Radio, Divider } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { schema, TSchema } from './ShippingSettings.config'
import { usePsaShippingMutation, useGetShippingQuery } from '@/redux/api/psaSetting.api'
import { useReduxSelector } from '@/hooks'

const ShippingSettings = () => {
  const [psaShipping] = usePsaShippingMutation()
  const { data: getShipping, refetch, isLoading, isError } = useGetShippingQuery()
  const store = useReduxSelector((state) => state?.profile?.profile?.store)
  const currency_symbol = store?.currency_symbol

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: { result: getShipping?.result || [] },
  })

  const { fields } = useFieldArray({ control, name: 'result' })

  useEffect(() => {
    if (getShipping) {
      reset(getShipping)
    }
  }, [getShipping, reset])

  const onSubmit = async (data: TSchema) => {
    const newData = { ...data, result: data.result ?? [] }

    const transformedPayload = {
      store_shipping: newData.result.map((item: any) => ({
        id: item.id,
        enable_shipping: item.enable_shipping,
        api_key: item.api_key,
        dev_mode: item.dev_mode,
        shipping_key: item.shipping_key,
        shipping_label: item.shipping_label,
        settings:
          item.shipping_key === 'flat_rate'
            ? {}
            : {
                shipping_method: item.settings?.shipping_method || [],
              },
        cost: item.cost,
      })),
    }

    await psaShipping(transformedPayload).unwrap()
    refetch()
  }

  return (
    <RenderContent loading={isLoading} error={isError}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
        <Grid container spacing={1}>
          {fields.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.shipping_key === 'flat_rate' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction={'column'}>
                      <Typography variant="subtitle1">{item.shipping_label}</Typography>
                      <TextInput name={`result.${index}.cost`} control={control} label="Cost" placeholder="Enter Cost" defaultValue={item.cost} type="number" currency_symbol={currency_symbol} />
                    </Stack>
                  </Grid>
                  <Divider />
                </>
              )}

              {item.shipping_key === 'aus_post' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction={'column'}>
                      <Typography variant="subtitle1">{item.shipping_label}</Typography>
                      <TextInput name={`result.${index}.api_key`} control={control} label="API Key" placeholder="Enter API key" />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl>
                      <Controller
                        name={`result.${index}.dev_mode`}
                        control={control}
                        defaultValue={item.dev_mode ?? false}
                        render={({ field }) => (
                          <RadioGroup row {...field} value={field.value ? 'livemode' : 'testmode'} onChange={(e) => field.onChange(e.target.value === 'livemode')}>
                            <FormControlLabel value="testmode" control={<Radio />} label="Test Mode" />
                            <FormControlLabel value="livemode" control={<Radio />} label="Live Mode" />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="subtitle1">Shipping Methods</Typography>
                      <Stack direction={{ md: 'column', xs: 'row' }}>
                        <Controller
                          name={`result.${index}.settings.shipping_method`}
                          control={control}
                          defaultValue={item.settings?.shipping_method || []}
                          render={({ field }) => {
                            const currentValue = field.value || []

                            const handleCheckboxChange = (method: string, isChecked: boolean) => {
                              const updatedValue = isChecked ? [...currentValue, method] : currentValue.filter((val) => val !== method)
                              field.onChange(updatedValue)
                            }

                            return (
                              <Stack spacing={1}>
                                <FormControlLabel
                                  control={<Checkbox checked={currentValue.includes('express')} onChange={(e) => handleCheckboxChange('express', e.target.checked)} />}
                                  label="Express with signature & insurance"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={currentValue.includes('regular')} onChange={(e) => handleCheckboxChange('regular', e.target.checked)} />}
                                  label="Regular with signature & insurance"
                                />
                                {errors?.result?.[index]?.settings?.shipping_method && (
                                  <Typography color="error" variant="caption">
                                    {errors.result[index].settings.shipping_method.message}
                                  </Typography>
                                )}
                              </Stack>
                            )
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                </>
              )}
            </React.Fragment>
          ))}
        </Grid>
        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Grid>
      </Stack>
    </RenderContent>
  )
}

export default ShippingSettings
