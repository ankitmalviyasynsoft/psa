// SubmissionFormHeader.tsx
import Grid from '@mui/material/Grid2'

import { Stack, FormLabel } from '@mui/material'
import SelectOption from '@/components/_ui/selectOption/Select.component'
import TextInput from '@/components/_ui/textInputField/TextField.component'
import { SubmissionFormHeaderProps } from './SubmissionFormHeader.type'

const SubmissionFormHeader: React.FC<SubmissionFormHeaderProps> = ({ services, currency_symbol, control, handleLevelChange }) => {
  return (
    <Stack direction="row" spacing={2.5} justifyContent="space-between">
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel>Submission Level</FormLabel>
        <SelectOption name="submissionlevel" options={services.map((s) => `${s.name} - ${currency_symbol} ${s.cost} p/card`)} control={control} onChange={(e) => handleLevelChange(e.target.value)} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextInput name="etm" control={control} label="Estimated Turnaround Time" disabled />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextInput name="max_declared_value" control={control} label="Maximum Declared Value p/card USD" disabled currency_symbol={currency_symbol} />
      </Grid>
    </Stack>
  )
}

export default SubmissionFormHeader

{
  /* <SubmissionFormHeader
      services={services}
      currency_symbol={currency_symbol}
      control={control}
      handleLevelChange={handleLevelChange}
    />

    <CardFormList
      fields={fields}
      control={control}
      errors={errors}
      register={register}
      update={update}
      remove={remove}
      refetch={refetch}
      clearErrors={clearErrors}
      trigger={trigger}
      cardList={cardList}
      debouncedSearch={debouncedSearch}
      setValue={setValue}
      append={append}
      handleAddCard={handleAddCard}
      submitForm={submitForm}
      currency_symbol={currency_symbol}
      setIsCustomCardFormOpen={setIsCustomCardFormOpen}
    /> */
}
