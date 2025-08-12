import React from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'

import TextInput from '@/components/_ui/textInputField/TextField.component'
import { schema, TSchema } from './adminSubmissionModel.config'
import { useGetSubmissionTempUpdateStatusMutation } from '@/redux/api/getAdminPSASubmissionList.api'

interface AdminSubmissionModal {
  openModal: boolean
  onClose: () => void
  selectedTempSubmission: string
  refetch: () => void
}

export const AdminSubmissionModal: React.FC<AdminSubmissionModal> = ({ openModal, onClose, selectedTempSubmission, refetch }) => {
  const [getSubmissionUpdateStatus] = useGetSubmissionTempUpdateStatusMutation()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: TSchema) => {
    const payload = {
      t_submission_number: selectedTempSubmission,
      submission_number: data.submission_number,
      key: 'submitted',
    }

    await getSubmissionUpdateStatus(payload).unwrap()
    refetch()
    onClose()
  }

  return (
    <Dialog open={openModal} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Submission</DialogTitle>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextInput name="submission_number" type="number" control={control} label="Submission Number" placeholder="Enter Submission Number" />
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

export default AdminSubmissionModal
