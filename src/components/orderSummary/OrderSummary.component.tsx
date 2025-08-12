import Grid from '@mui/material/Grid2'
import { FormLabel, Typography, Stack } from '@mui/material'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import { OrderSummaryProps } from './OrderSummary.type'

const OrderSummary = ({ control, currency_symbol, wantCardClean }: OrderSummaryProps) => {
  return (
    <>
      <Typography variant="h6">Order Summary</Typography>
      <Stack spacing={1} maxWidth="sm">
        <FormLabel>Submission Level</FormLabel>
        <Grid size={{ xs: 4, md: 2 }}>
          <TextInput name="submissionLevel" control={control} disabled />
        </Grid>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>No. of Cards</FormLabel>
          <TextInput name="numberOfCards" control={control} disabled />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>Cost per Card</FormLabel>
          <TextInput name="costPerCard" control={control} currency_symbol={currency_symbol} disabled />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>Total</FormLabel>
          <TextInput name="totalCost" control={control} currency_symbol={currency_symbol} disabled />
        </Grid>
      </Grid>
      {wantCardClean && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 4, md: 2 }}>
            <FormLabel>No. of Cards</FormLabel>
            <TextInput name="numberOfCards" control={control} disabled />
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <FormLabel>Cleaning Cost</FormLabel>
            <TextInput name="costPerCardForCleaning" control={control} currency_symbol={currency_symbol} disabled />
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <FormLabel>Total</FormLabel>
            <TextInput name="totalCostForCleaning" control={control} currency_symbol={currency_symbol} disabled />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>Sub Total</FormLabel>
          <TextInput name="sub_total" control={control} currency_symbol={currency_symbol} disabled />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>Discount</FormLabel>
          <TextInput name="totalDiscount" control={control} currency_symbol={currency_symbol} disabled />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>Shipping Fee</FormLabel>
          <TextInput name="shippingCost" control={control} currency_symbol={currency_symbol} disabled />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }}>
          <FormLabel>Total Payment</FormLabel>
          <TextInput name="totalPayment" control={control} currency_symbol={currency_symbol} disabled />
        </Grid>
      </Grid>
    </>
  )
}

export default OrderSummary
