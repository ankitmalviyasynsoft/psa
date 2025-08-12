import Papa from 'papaparse'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MdOutlineDelete } from 'react-icons/md'
import { Box, Button, CircularProgress, debounce, FormLabel, Stack, TextField, Typography } from '@mui/material'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import SelectOption from '@/components/_ui/selectOption/Select.component'
import ImagePreview from '@/components/imagePreview/ImagePreview.component'
import AddCustomCard from '@/components/addCustomerCardForm/AddCustomerCardForm'
import { style } from './submissionForm.style'
import { schema, TSchema } from './submissionForm.config'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { useAddNewCardMutation, useGetCardListQuery } from '@/redux/api/card.api'
import { createNewSubmission } from '@/redux/slice/newSubmission.slice'
import { setselectedService } from '@/redux/slice/selectedService.slice'
import { useCreateOrderOnBehalfMutation } from '@/redux/api/createOrder.api'
import { formatCardLabel } from '@/utils/formatLabel.util'

function SubmissionForm({ handleBack, steps, activeStep }: any) {
  const router = useRouter()
  const dispatch = useReduxDispatch()
  const filter = createFilterOptions()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [addNewCard] = useAddNewCardMutation()
  const [createOrderOnBehalf] = useCreateOrderOnBehalfMutation()
  const storeData = useReduxSelector((state) => state.selectedStore)
  const order = useReduxSelector((state: any) => state.newSubmission.order)
  const orderAsRetailor = useReduxSelector((state) => state.customerProfile.orderAsRetailor)
  const selectedService = useReduxSelector((state) => state.selectedService)
  const services = storeData?.psaSettings?.services || []
  const { currency_code, currency_symbol } = useReduxSelector((state) => state.selectedStore)

  const cardClean = ['Yes', 'No']
  const [cardList, setCardList] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [maxDeclaredValue, setMaxDeclaredValue] = useState<number>(0)
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState<number>(1)
  const [wantCardClean, setWantCardClean] = useState<boolean>(true)
  const [isCustomCardFormOpen, setIsCustomCardFormOpen] = useState(false)

  const [cardAddingLoader, setCardAddingLoader] = useState<boolean>(false)

  const discountpercard = selectedService.bulk_discount
  const minQuantityDiscount = selectedService.quantity
  const flatRateShipping = storeData?.storeShipping?.find((shipping: any) => shipping.shipping_key === 'flat_rate')
  const shippingCost = flatRateShipping ? flatRateShipping.cost : 0
  const costPerCardForCleaning = storeData?.psaSettings.card_cleaning_fees || 0
  const shipping = useMemo(() => {
    const options = []
    if (storeData.psaSettings.enable_dropoff) options.push('Drop Off')
    if (storeData.psaSettings.enable_shipping) options.push('Shipping')
    return options
  }, [storeData])

  const { data: getCardList, refetch } = useGetCardListQuery({ searchVal: searchValue, page: 1, limit: 25 })

  useEffect(() => {
    if (getCardList) {
      setCardList(getCardList?.result)
    }
  }, [getCardList, order, refetch, flatRateShipping])

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    register,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    context: { maxDeclaredValue, minimumOrderQuantity },
    defaultValues: {
      cards:
        Array.isArray(order?.orderItems) && order.orderItems.length > 0
          ? order.orderItems.map((item: any) => ({
              id: item.id || null,
              uid: item.uid || null,
              card_name: item.name || item.card_name,
              declared_value: item.declared_value,
              image_link: item.image_link || null,
            }))
          : [{ id: null, card_name: '', declared_value: 0 }],
    },
  })

  const handleAddCard = () => {
    append({ id: null, uid: null, card_name: '', declared_value: 0, image_link: '' })
    setSearchValue('')
    refetch()
  }

  useEffect(() => {
    if (flatRateShipping) {
      setValue('shippingCost', flatRateShipping.cost)
    } else {
      setValue('shippingCost', 0)
    }
  }, [flatRateShipping, setValue])

  useEffect(() => {
    if (services.length > 0) {
      const defaultService = services[0]

      dispatch(setselectedService(defaultService))

      setValue('submissionlevel', `${defaultService.name} - ${currency_symbol} ${defaultService.cost} p/card`)
      setValue('etm', `${defaultService.days} ${defaultService.days_label}`)
      setValue('max_declared_value', defaultService.max_declared_value)
      setMaxDeclaredValue(defaultService.max_declared_value)
      setMinimumOrderQuantity(defaultService.minimum_card_req)
    }
  }, [services, setValue, dispatch])

  const selectedShippingMethod = useWatch({ control, name: 'shipping' })

  const handleLevelChange = (selectedLabel: string) => {
    const selectedServiceName = selectedLabel.split(' - ')[0]

    const selectedService = services.find((service: any) => service.name === selectedServiceName)

    if (selectedService) {
      setMaxDeclaredValue(selectedService.max_declared_value)
      setMinimumOrderQuantity(selectedService.minimum_card_req)

      setValue('etm', `${selectedService.days} ${selectedService.days_label}`)
      setValue('max_declared_value', selectedService.max_declared_value)
      setValue('submissionlevel', `${selectedService.name} - $${selectedService.cost} p/card`)

      dispatch(setselectedService(selectedService))
    }
  }

  const handleCardClean = (event: any) => {
    const selectedValue = event.target.value as string
    setWantCardClean(selectedValue === 'Yes')
  }

  const onSubmit = async (data: TSchema) => {
    const orderItems = (data?.cards || []).map((card) => ({
      uid: card.uid,
      card_name: card.card_name,
      declared_value: card.declared_value,
      image_link: card.image_link || '',
    }))

    const { userDetails, ...restOrderCustomer } = order?.orderCustomer

    const numberOfCards = orderItems.length
    const costPerCard = selectedService.cost
    const totalCost = numberOfCards * costPerCard
    const totalCostForCleaning = wantCardClean ? numberOfCards * costPerCardForCleaning : 0
    const sub_total = totalCost + (wantCardClean ? totalCostForCleaning : 0)
    const totalDiscount = numberOfCards >= minQuantityDiscount ? numberOfCards * discountpercard : 0
    const totalPayment = totalCost + totalCostForCleaning - totalDiscount + shippingCost

    const submissionPayload = {
      storeId: storeData?.id,
      total: totalPayment,
      sub_total: sub_total,
      status: 'pending',
      discount: totalDiscount,
      rate: costPerCard,
      quantity: numberOfCards,
      shipping_total: shippingCost,
      userId: order?.orderCustomer?.id,
      currency_symbol: currency_symbol,
      currency_code: currency_code,
      orderAsRetailor: orderAsRetailor,
      orderItems: orderItems,
      orderCustomer: {
        firstName: restOrderCustomer.firstName,
        lastName: restOrderCustomer.lastName,
        email: restOrderCustomer.email,
        phone: restOrderCustomer.phone,
        address_1: userDetails?.address_1,
        address_2: userDetails?.address_2,
        city: userDetails?.city,
        state: userDetails?.state,
        zip_code: userDetails?.zip_code,
      },
      orderTransaction: {
        payment_method: 'bankTransfer',
      },
      orderPSAService: {
        psa_selected_services: {
          enable_psa_submissions: storeData?.psaSettings?.enable_psa_submissions || false,
          card_cleaning_fees: storeData?.psaSettings?.card_cleaning_fees || 0,
          enable_card_cleaning: storeData?.psaSettings?.enable_card_cleaning || false,
          psa_setting_service_id: selectedService?.id,
        },
        card_cleaning: wantCardClean,
        quantity: numberOfCards,
        rate: costPerCard,
        total: totalPayment,
      },
    }

    const response = await createOrderOnBehalf(submissionPayload)
    if (response.data?.statusCode === 200) {
      router.push('/admin/psa-unpaid-customer-submissions')
    } else {
      console.error('Error creating order:', response.error)
    }
  }

  const handleBackButton = () => {
    const formData = getValues()
    dispatch(createNewSubmission({ ...order, orderItems: formData.cards || [{ title: '', declared_value: 0 }] }))
    handleBack()
  }

  const { fields, append, remove, update } = useFieldArray({ control, name: 'cards' })

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setSearchValue(searchValue)
      refetch()
    }, 500),
    [],
  )

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (file.type !== 'text/csv' && extension !== 'csv') {
      toast.error('Only CSV files are allowed.')
      return
    }

    setCardAddingLoader(true)

    setTimeout(() => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: (results: any) => {
          const [headers, ...rows] = results.data as string[][]

          const parsedCards = rows
            .filter((row) => row.length >= 9 && row[3]?.trim())
            .map((row) => {
              const card = {
                expansion: row[0]?.trim() || '',
                game_title: row[1]?.trim() || '',
                title: row[2]?.trim() || '',
                number: row[3]?.trim() || '',
                tcgplayer_id: row[4]?.trim() || '',
                rarity: row[5]?.trim() || '',
                abbreviation: row[6]?.trim() || '',
                year: row[7]?.trim() || '',
                image_link: row[8]?.trim() || '',
                declared_value: 1,
              }

              return {
                ...card,
                card_name: formatCardLabel(card),
              }
            })

          if (!parsedCards.length) {
            toast.error('CSV is empty or invalid.')
            setCardAddingLoader(false)
            return
          }

          const currentCards = getValues('cards')

          if (currentCards?.length === 1 && !currentCards[0]?.card_name?.trim()) {
            const first = parsedCards[0]
            setValue('cards.0.card_name', first.card_name)
            setValue('cards.0.uid', Number(first.tcgplayer_id))
            setValue('cards.0.image_link', first.image_link)
            setValue('cards.0.declared_value', first.declared_value)

            if (parsedCards.length > 1) {
              append(parsedCards.slice(1))
            }
          } else {
            append(parsedCards)
          }

          clearErrors('cards')
          setCardAddingLoader(false)
        },
        error: (err: any) => {
          toast.error('Failed to parse CSV file.')
          console.error(err)
          setCardAddingLoader(false)
        },
      })
    }, 100)
  }

  return (
    <Stack sx={style.root}>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormLabel>Submission Level</FormLabel>
            <SelectOption
              name="submissionlevel"
              options={services.map((service: any) => `${service.name} - ${currency_symbol} ${service.cost} p/card`)}
              control={control}
              onChange={(event) => handleLevelChange(event.target.value)}
            />
          </Grid>

          {/* Estimated Turnaround Time */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextInput name="etm" control={control} label="Estimated Turnaround Time" disabled />
          </Grid>

          {/* Maximum Declared Value */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextInput name="max_declared_value" control={control} label="Maximum Declared Value p/card USD" currency_symbol={currency_symbol} disabled />
          </Grid>
        </Stack>
        {!cardAddingLoader ? (
          <Grid container spacing={2.5}>
            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Stack direction={'column'}>
                    {index === 0 && <FormLabel>Lot Number</FormLabel>}
                    <Typography sx={{ display: 'flex', alignItems: 'center', height: '48px' }}>{index + 1}</Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  {index === 0 && <FormLabel>Card Details</FormLabel>}
                  <Stack direction="row" spacing={2} alignItems="center">
                    {field.image_link ? <ImagePreview src={field.image_link} alt={`Card-${index + 1}`} /> : <Box width={40} height={40} bgcolor="#f0f0f0" borderRadius={1} />}
                    <Box sx={{ flex: 1 }}>
                      <Autocomplete
                        value={field.card_name || ''}
                        onInputChange={(_, newInputValue) => debouncedSearch(newInputValue)}
                        onChange={(_, newValue) => {
                          if (!newValue) {
                            update(index, { ...field, id: null, uid: null, card_name: '', declared_value: 0, image_link: '' })
                            return
                          }

                          if (newValue.isCustom) {
                            setIsCustomCardFormOpen(true)
                            return
                          }

                          // User selected a card from the list
                          update(index, { ...field, id: null, uid: newValue.uid, card_name: formatCardLabel(newValue), declared_value: newValue.declared_value, image_link: newValue.image_link || '' })

                          setValue(`cards.${index}.uid`, newValue.uid)
                          setValue(`cards.${index}.declared_value`, newValue.declared_value)
                          setValue(`cards.${index}.image_link`, newValue.image_link || '')

                          clearErrors(`cards.${index}.card_name`)
                          // trigger(`cards.${index}.card_name`)
                          // trigger(`cards.${index}.declared_value`)
                          // trigger('cards')

                          setSearchValue('')
                          refetch()
                        }}
                        // filterOptions={(options, params) => {
                        //   const filtered = filter(options, params)
                        //   const manualAddOption = {
                        //     label: "Don't see your card? Add it manually",
                        //     isCustom: true,
                        //   }
                        //   return [manualAddOption, ...filtered]
                        // }}
                        filterOptions={(options, params) => {
                          const input = params.inputValue.toLowerCase()

                          const filtered = options.filter((option) => {
                            const label = formatCardLabel(option).toLowerCase()
                            const number = option.number?.toLowerCase() || ''
                            const title = option.title?.toLowerCase() || ''

                            return label.includes(input) || number.includes(input) || title.includes(input)
                          })

                          const manualAddOption = {
                            label: "Don't see your card? Add it manually",
                            isCustom: true,
                          }

                          return [manualAddOption, ...filtered]
                        }}
                        options={cardList}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.inputValue ? option.inputValue : formatCardLabel(option))}
                        renderOption={(props, option) => {
                          const { key, ...otherProps } = props

                          if (option.isCustom) {
                            return (
                              <li key={key} {...otherProps} style={{ fontWeight: 600, color: '#1976d2' }}>
                                {option.label}
                              </li>
                            )
                          }

                          return (
                            <li key={key} {...otherProps}>
                              {option.image_link ? (
                                <Image src={option.image_link} alt={option.title} width={40} height={40} style={{ marginRight: 10, borderRadius: 4 }} />
                              ) : (
                                <Box width={40} height={40} sx={{ bgcolor: '#f0f0f0', borderRadius: 1, marginRight: 1 }} />
                              )}
                              {formatCardLabel(option)}
                            </li>
                          )
                        }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...register(`cards.${index}.card_name` as const)}
                            placeholder="Enter Card"
                            error={!!errors.cards?.[index]?.card_name}
                            helperText={errors.cards?.[index]?.card_name?.message}
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextInput
                    name={`cards[${index}].declared_value` as `cards.${number}.declared_value`}
                    control={control}
                    label={index === 0 ? 'USD Declared Value' : ''}
                    placeholder="USD Declared Value"
                    type="number"
                    currency_symbol={currency_symbol}
                  />
                </Grid>
                {index !== 0 && (
                  <Grid size={{ xs: 12, md: 1 }} display="flex" alignItems="center">
                    <MdOutlineDelete size={24} onClick={() => remove(index)} style={{ cursor: 'pointer' }} />
                  </Grid>
                )}
              </React.Fragment>
            ))}
            {errors.cards?.root?.message && <Typography color="#d32f2f">{errors?.cards?.root?.message}</Typography>}
          </Grid>
        ) : (
          <Box height={300} display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="success" size={64} />
          </Box>
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button size="small" color="error" variant="contained" onClick={handleAddCard}>
            Add Card
          </Button>

          <Button size="small" variant="contained" onClick={handleFileButtonClick}>
            Upload CSV
          </Button>
          <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelection} />
        </Stack>

        <Typography variant="h6">Additional Items</Typography>
        {storeData?.psaSettings.enable_card_cleaning && (
          <Grid container alignItems="center" spacing={1}>
            <Grid size={{ xs: 6, md: 4 }}>
              <FormLabel>Would you like to clean your cards prior to submission?</FormLabel>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <SelectOption name="card_cleaning" options={cardClean} control={control} inputProps={{ 'aria-label': 'Cleaning option' }} onChange={handleCardClean} defaultValue={wantCardClean ? 'Yes' : 'No'} />
            </Grid>
          </Grid>
        )}

        <Grid container alignItems="center" spacing={1}>
          <Grid size={{ xs: 6, md: 4 }}>
            <FormLabel>Are you shipping or dropping off your cards to "{storeData.name}"?</FormLabel>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <SelectOption name="shipping" options={shipping} control={control} defaultValue={shipping[0]} inputProps={{ 'aria-label': 'Shipping option' }} />
          </Grid>
        </Grid>

        {selectedShippingMethod === 'Shipping' && (
          <Grid container alignItems="center" spacing={1}>
            <Grid size={{ xs: 6, md: 4 }}>
              <FormLabel>Shipping Cost</FormLabel>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextInput name="shippingCost" control={control} currency_symbol={currency_symbol} disabled />
            </Grid>
          </Grid>
        )}
        <Grid size={{ xs: 12 }}>
          <Stack direction={'row'} mt={2} justifyContent={'space-between'}>
            <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={handleBackButton} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button type="submit" variant="contained">
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Stack>
        </Grid>
      </Stack>
      {isCustomCardFormOpen && <AddCustomCard onClose={() => setIsCustomCardFormOpen(false)} />}
    </Stack>
  )
}

export default SubmissionForm
