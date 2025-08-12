// CardFormList.tsx
import React from 'react'
import Grid from '@mui/material/Grid2'
import Image from 'next/image'
import { Stack, Typography, TextField, Box, Button } from '@mui/material'
import { MdOutlineDelete } from 'react-icons/md'

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import ImagePreview from '@/components/imagePreview/ImagePreview.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import { formatCardLabel } from '@/utils/formatLabel.util'
import { CardFormListProps } from './CardFormList.type'

const filter = createFilterOptions()

const CardFormList: React.FC<CardFormListProps> = ({
  fields,
  control,
  errors,
  register,
  update,
  remove,
  refetch,
  clearErrors,
  trigger,
  cardList,
  debouncedSearch,
  setValue,
  append,
  handleAddCard,
  submitForm,
  currency_symbol,
  setIsCustomCardFormOpen,
}) => {
  return (
    <>
      <Grid container spacing={2.5}>
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <Grid size={{ xs: 12, md: 2 }}>
              {index === 0 && <Typography>Lot Number</Typography>}
              <Typography>{index + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {index === 0 && <Typography>Card Details</Typography>}
              <Stack direction="row" spacing={2}>
                {field.image_link ? <ImagePreview src={field.image_link} alt={`Card-${index + 1}`} /> : <Box width={40} height={40} bgcolor="#f0f0f0" borderRadius={1} />}
                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    value={field.card_name || ''}
                    onInputChange={(_, val) => debouncedSearch(val)}
                    onChange={(_, newVal) => {
                      if (!newVal) {
                        update(index, { ...field, id: null, uid: null, card_name: '', declared_value: 0, image_link: '' })
                        return
                      }
                      if (newVal.isCustom) {
                        setIsCustomCardFormOpen(true)
                        return
                      }
                      update(index, {
                        ...field,
                        uid: newVal.uid,
                        card_name: formatCardLabel(newVal),
                        declared_value: newVal.declared_value,
                        image_link: newVal.image_link || '',
                      })
                      setValue(`cards.${index}.uid`, newVal.uid)
                      setValue(`cards.${index}.declared_value`, newVal.declared_value)
                      setValue(`cards.${index}.image_link`, newVal.image_link || '')
                      clearErrors(`cards.${index}.card_name`)
                      trigger(`cards.${index}.card_name`)
                      trigger(`cards.${index}.declared_value`)
                      refetch()
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params)
                      const manualAdd = { label: "Don't see your card? Add it manually", isCustom: true }
                      return [manualAdd, ...filtered]
                    }}
                    options={cardList}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.inputValue || formatCardLabel(option))}
                    renderOption={(props, option) => (
                      <li {...props}>
                        {option.isCustom ? (
                          <Typography fontWeight={600} color="primary">
                            {option.label}
                          </Typography>
                        ) : (
                          <>
                            {option.image_link && <Image src={option.image_link} alt={option.title} width={40} height={40} style={{ marginRight: 10, borderRadius: 4 }} />}
                            {formatCardLabel(option)}
                          </>
                        )}
                      </li>
                    )}
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
              <TextInput name={`cards.${index}.declared_value` as const} control={control} label={index === 0 ? 'USD Declared Value' : ''} placeholder="USD Declared Value" type="number" currency_symbol={currency_symbol} />
            </Grid>
            {index !== 0 && (
              <Grid size={{ xs: 12, md: 1 }} display="flex" alignItems="center">
                <MdOutlineDelete size={24} onClick={() => remove(index)} style={{ cursor: 'pointer' }} />
              </Grid>
            )}
          </React.Fragment>
        ))}
        <Grid size={{ xs: 12 }}>
          <Stack direction="row" justifyContent="space-between">
            <Button size="small" color="error" variant="contained" onClick={handleAddCard}>
              Add Card
            </Button>
            <Button size="small" variant="contained" onClick={() => submitForm(true)}>
              Update as Draft
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default CardFormList
