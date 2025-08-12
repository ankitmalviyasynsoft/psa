import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Divider, FormControlLabel, Stack, Switch, Typography } from '@mui/material'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { useGetPaymentMethodListQuery, useSavePaymentMethodListMutation } from '@/redux/api/psaSetting.api'
import { schema, TSchema } from './PaymentSettings.config'
import { formatLabel } from '@/utils/formatLabel.util'

const PaymentSettings = () => {
  const { data: getPaymentMethodList, refetch, isLoading, isError } = useGetPaymentMethodListQuery()
  const [savePaymentMethodList] = useSavePaymentMethodListMutation()
  const [settingsEnabled, setSettingsEnabled] = useState<{ [key: string]: boolean }>({})

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    context: { settingsEnabled },
    defaultValues: { result: getPaymentMethodList?.result || [] },
  })

  useEffect(() => {
    if (getPaymentMethodList?.result) {
      reset({ result: getPaymentMethodList.result })
      const initialSettingsEnabled: { [key: string]: boolean } = {}
      getPaymentMethodList.result.forEach((method, index) => {
        initialSettingsEnabled[index] = method.payment_meta?.some((meta) => meta.value)
      })
      setSettingsEnabled(initialSettingsEnabled)
    }
  }, [getPaymentMethodList, reset])

  const { fields } = useFieldArray({ control, name: 'result' })

  const onSubmit = async (data: TSchema) => {
    let hasError = false

    ;(data.result ?? []).forEach((method: any, methodIndex: number) => {
      if (settingsEnabled[methodIndex]) {
        method.payment_meta.forEach((meta: any, metaIndex: number) => {
          if (!meta.value?.trim()) {
            setError(`result.${methodIndex}.payment_meta.${metaIndex}.value`, {
              type: 'manual',
              message: '*Required',
            })
            hasError = true
          }
        })
      }
    })

    if (hasError) return // Stop if validation fails

    const payload = {
      payment_methods: (data.result ?? []).map((method, methodIndex) => ({
        id: method.id,
        status: method.status,
        name: method.name,
        key: method.key,
        api_key: method.api_key,
        is_dev: method.is_dev,
        payment_meta: settingsEnabled[methodIndex]
          ? (method.payment_meta ?? []).map((meta) => ({
              id: meta.id,
              key: meta.key,
              value: meta.value,
            }))
          : [], // ⛔️ Don't send meta if switch is off
      })),
    }

    await savePaymentMethodList(payload).unwrap()
    refetch()
  }

  const handleSettingsSwitchChange = (index: number, checked: boolean) => {
    setSettingsEnabled((prev) => ({ ...prev, [index]: checked }))
  }

  return (
    <RenderContent loading={isLoading} error={isError}>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          <div key={item.id}>
            <Grid container alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Controller name={`result.${index}.status`} control={control} render={({ field }) => <FormControlLabel label="Enable" control={<Switch {...field} checked={field.value || false} />} />} />
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">Provide Your Settings</Typography>
                  <FormControlLabel control={<Switch checked={settingsEnabled[index] || false} onChange={(e) => handleSettingsSwitchChange(index, e.target.checked)} />} label="Yes/No" />
                </Stack>
              </Grid>
            </Grid>
            <Stack spacing={2}>
              {item.payment_meta?.map((meta: any, metaIndex: any) => (
                <Grid container spacing={1} key={meta.id}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextInput
                      name={`result.${index}.payment_meta.${metaIndex}.value`}
                      control={control}
                      label={formatLabel(meta.key)}
                      placeholder={`Enter ${formatLabel(meta.key)}`}
                      disabled={!settingsEnabled[index]}
                      // required={settingsEnabled[index]}
                    />
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </div>
        ))}
        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Grid>
      </Stack>
    </RenderContent>
  )
}

export default PaymentSettings
