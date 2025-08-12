import React from 'react'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'

import TextInput from '../_ui/textInputField/TextField.component'
import { schema, TSchema } from './AddCustomerCardForm.config'
import { useAddNewCardMutation } from '@/redux/api/card.api'

interface CustomCardFormProps {
  onClose: () => void
}

export const AddCustomCard: React.FC<CustomCardFormProps> = ({ onClose }) => {
  const [addNewCard] = useAddNewCardMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: TSchema) => {
    await addNewCard(data).unwrap()
    reset()
    onClose()
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <TextInput name="title" control={control} label="Enter Card Name" placeholder="Enter Card Name" />
          <TextInput name="game_title" control={control} label="Enter Game Title" placeholder="Enter Game Title" />
          <TextInput name="number" control={control} label="Enter Card Number" placeholder="Enter Card Number" />
          <TextInput name="expansion" control={control} label="Enter Expansion Name" placeholder="Enter Expansion Name" />
          <TextInput name="year" type="number" control={control} label="Enter Year" placeholder="Enter Year" />
          <TextInput name="declared_value" type="number" control={control} label="Enter Declared Value" placeholder="Enter Declared Value" />
          <DialogActions>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>
            <Button size="small" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default AddCustomCard
