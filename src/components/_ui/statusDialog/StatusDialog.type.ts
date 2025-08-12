export interface StatusDialogProps {
  open: boolean
  message: string
  title: string
  status?: 'success' | 'error'
  onClose: () => void
  onConfirm?: () => void
}
