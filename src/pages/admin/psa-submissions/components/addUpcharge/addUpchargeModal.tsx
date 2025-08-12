import React from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import { schema, TSchema } from './addUpchargeModel.config'
import { useUpdateUpchargeMutation } from '@/redux/api/getAdminPSASubmissionList.api'

interface AddUpchanrgeModal {
  openModal: boolean
  onClose: () => void
  selectedOrderItem: string
  selectedOrderId: number
  refetch: () => void
  currency_symbol: string
}

export const AddUpchanrgeModal: React.FC<AddUpchanrgeModal> = ({ openModal, onClose, selectedOrderItem, selectedOrderId, refetch, currency_symbol }) => {
  const [updateUpcharge] = useUpdateUpchargeMutation()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: TSchema) => {
    const payload = {
      orderItemArray: [{ orderItemID: selectedOrderItem, amount: data.due_amount }],
      order_id: selectedOrderId,
      key: 'update',
    }
    await updateUpcharge(payload).unwrap()
    refetch()
    onClose()
  }

  return (
    <Dialog open={openModal} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Upcharge</DialogTitle>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextInput name="due_amount" type="number" control={control} label="Due amount" placeholder="Enter Due Amount" currency_symbol={currency_symbol} />
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" size="small" type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
          <Button size="small" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddUpchanrgeModal
