import React from 'react'
import { Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { StatusDialogProps } from './StatusDialog.type'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { AiOutlineCloseCircle } from 'react-icons/ai'

export default function StatusDialog(props: StatusDialogProps) {
  const { open, message, title, status, onClose, onConfirm } = props

  const handleClose = () => {
    onClose()
    if (onConfirm) onConfirm()
  }

  const icon = status === 'success' ? <AiOutlineCheckCircle color="green" size={60} /> : <AiOutlineCloseCircle color="red" size={60} />

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Stack spacing={2} alignItems="center" textAlign="center">
          {icon}
          <DialogTitle sx={{ textAlign: 'center', p: 0 }}>{title}</DialogTitle>
          <Typography>{message}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={handleClose} variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
