import React from 'react'
import Grid from '@mui/material/Grid2'
import { MdOutlineDelete } from 'react-icons/md'
import { Control, UseFieldArrayRemove } from 'react-hook-form'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import { TSchema } from '../PSASettings.config'

type Props = {
  index: number
  control: Control<TSchema>
  remove: UseFieldArrayRemove
  currency_symbol?: string
  showDelete: boolean
}

const PSAServiceOfferings: React.FC<Props> = ({ index, control, remove, currency_symbol, showDelete }) => {
  return (
    <>
      {/* Label Name */}
      <Grid size={{ xs: 12, md: 2 }}>
        <TextInput name={`services.${index}.name`} control={control} label={index === 0 ? 'Label Name' : ''} placeholder="Label Name" />
      </Grid>

      {/* Days */}
      <Grid size={{ xs: 12, md: 1 }}>
        <TextInput name={`services.${index}.days`} control={control} label={index === 0 ? 'Days' : ''} placeholder="Days" type="number" />
      </Grid>

      {/* Turn Around */}
      <Grid size={{ xs: 12, md: 2 }}>
        <TextInput name={`services.${index}.days_label`} control={control} label={index === 0 ? 'Ex Turn Around' : ''} placeholder="Turn Around" />
      </Grid>

      {/* Declared Value */}
      <Grid size={{ xs: 12, md: 2 }}>
        <TextInput name={`services.${index}.max_declared_value`} control={control} label={index === 0 ? 'Max Declared Value' : ''} placeholder="Declared Value" type="number" currency_symbol={currency_symbol} />
      </Grid>

      {/* Cost per card */}
      <Grid size={{ xs: 12, md: 1 }}>
        <TextInput name={`services.${index}.cost`} control={control} label={index === 0 ? 'Cost p/card' : ''} placeholder="Cost per card" type="number" currency_symbol={currency_symbol} />
      </Grid>

      {/* Min Card Req */}
      <Grid size={{ xs: 12, md: 1 }}>
        <TextInput name={`services.${index}.minimum_card_req`} control={control} label={index === 0 ? 'Min Card Req' : ''} placeholder="Min Req" type="number" />
      </Grid>

      {/* Bulk Disc p/card */}
      <Grid size={{ xs: 12, md: 1 }}>
        <TextInput name={`services.${index}.bulk_discount`} control={control} label={index === 0 ? 'Bulk Disc p/card' : ''} placeholder="Bulk Disc" type="number" currency_symbol={currency_symbol} />
      </Grid>

      {/* Qty for Discount */}
      <Grid size={{ xs: 12, md: 1 }}>
        <TextInput name={`services.${index}.quantity`} control={control} label={index === 0 ? 'Qty for Discount' : ''} placeholder="Qty" type="number" />
      </Grid>

      {showDelete && (
        <Grid size={{ xs: 12, md: 1 }} display="flex" alignItems="center">
          <MdOutlineDelete size={24} onClick={() => remove(index)} style={{ cursor: 'pointer' }} />
        </Grid>
      )}
    </>
  )
}

export default PSAServiceOfferings
