import React, { useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import { schema, TSchema } from './EditCardModal.config'
import { useEditCardMutation } from '@/redux/api/card.api'

interface EditCardModalProps {
  onClose: () => void
  selectedCard: TSchema & { id: number }
  refetch: () => void
}

const EditCardModal: React.FC<EditCardModalProps> = ({ onClose, selectedCard, refetch }) => {
  const [editCard] = useEditCardMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: selectedCard,
  })

  useEffect(() => {
    reset(selectedCard)
  }, [selectedCard, reset])

  const onSubmit = async (data: TSchema) => {
    await editCard({ id: selectedCard.id, body: data }).unwrap()
    refetch()
    onClose()
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Card</DialogTitle>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextInput name="title" control={control} label="Title" placeholder="Enter Title" />
            <TextInput name="game_title" control={control} label="Game Title" placeholder="Enter Game Title" />
            <TextInput name="expansion" control={control} label="Enter Expansion Name" placeholder="Enter Expansion Name" />
            <TextInput name="rarity" control={control} label="Enter Rarity Name" placeholder="Enter Rarity Name" />
            <TextInput name="number" control={control} label="Enter Card Number" placeholder="Enter Card Number" />
            <TextInput name="year" type="number" control={control} label="Enter Year" placeholder="Enter Year" />
            <TextInput name="abbreviation" control={control} label="Enter Abbreviation" placeholder="Enter Abbreviation" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" size="small" type="submit" loading={isSubmitting}>
            Save
          </LoadingButton>
          <Button size="small" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default EditCardModal
