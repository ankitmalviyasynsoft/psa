import { useRouter } from 'next/router'
import { Tooltip, IconButton, Button, Stack, CircularProgress } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { MdEdit, MdOutlineDelete, MdOutlinePrint, MdOutlinePublish, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { downloadFile } from '@/utils/downloadPdf.util'
import { useState } from 'react'
import { FaFileCsv, FaFilePdf } from 'react-icons/fa6'

export const useColumns = ({
  onPublishClick,
  onEditClick,
  onDeleteClick,
  onUnpublishedClick,
  onMarkCompletedClick,
}: {
  onPublishClick: (uuid: string) => void
  onEditClick: (t_submission_number: string) => void
  onDeleteClick: (row: any) => void
  onUnpublishedClick: (row: any) => void
  onMarkCompletedClick: (row: any) => void
}) => {
  const router = useRouter()
  const [downloadLoading, setDownloadLoading] = useState<{ [submissionNumber: string]: { pdf?: boolean; csv?: boolean } }>({})

  const handleCellClick = (submissionNumber: string) => {
    router.push(`/admin/psa-submissions/submissionUpdate?number=${submissionNumber}`)
  }

  const columns: GridColDef<any>[] = [
    {
      field: 'submissionNumber',
      headerName: 'Submission Number',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={() => handleCellClick(params.row.submissionNumber)}>
            {params.value}
          </span>
        ) : (
          'N/A'
        ),
    },
    { field: 'status', headerName: 'Status', flex: 1, sortable: false },
    {
      field: 'count',
      headerName: 'No. Of Orders',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { submissionNumber } = params.row

        return (
          <span
            onClick={() => {
              if (submissionNumber) {
                router.push(`/admin/psa-submissions/orders?submissionNumber=${submissionNumber}`)
              }
            }}
            style={{
              cursor: submissionNumber ? 'pointer' : 'default',
              color: submissionNumber ? 'blue' : 'inherit',
              textDecoration: submissionNumber ? 'underline' : 'none',
            }}
          >
            {params.value ?? 'N/A'}
          </span>
        )
      },
    },

    { field: 't_submission_number', headerName: 'Temporary Submission Number', flex: 1, sortable: false },
    { field: 'shippedDate', headerName: 'Shipped Date', flex: 1, sortable: false },
    { field: 'arrivedToPSA', headerName: 'Arrived to PSA', flex: 1, sortable: false },
    { field: 'arrivedBack', headerName: 'Arrived Back Date', flex: 1, sortable: false },
    { field: 'submission_status', headerName: 'Submission Status', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const { submissionNumber, t_submission_number, status, submission_status } = params.row

        if (submissionNumber) {
          if (status == 'sent-to-psa') {
            return (
              <>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Published</span>
                <IconButton onClick={() => onUnpublishedClick(t_submission_number)} color={submission_status == 'published' ? 'primary' : 'default'}>
                  <Tooltip title="Unpublish" placement="top">
                    <span>{submission_status == 'published' ? <MdVisibility size={24} color="green" /> : <MdVisibilityOff size={24} color="gray" />}</span>
                  </Tooltip>
                </IconButton>
              </>
            )
          } else {
            return <span style={{ color: 'green', fontWeight: 'bold' }}>Published</span>
          }
        }

        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Tooltip title="Edit" placement="top">
              <span>
                <MdEdit size={20} style={{ cursor: 'pointer' }} onClick={() => onEditClick(params.row.t_submission_number)} />
              </span>
            </Tooltip>

            <Tooltip title="Delete" placement="top">
              <span>
                <MdOutlineDelete size={20} style={{ cursor: 'pointer', color: 'red' }} onClick={() => onDeleteClick(params.row)} />
              </span>
            </Tooltip>

            <Tooltip title="Publish" placement="top">
              <span>
                <MdOutlinePublish size={20} style={{ cursor: 'pointer' }} onClick={() => onPublishClick(params.row.t_submission_number)} />
              </span>
            </Tooltip>
          </div>
        )
      },
    },
    {
      field: 'download',
      headerName: 'Download',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const { submissionNumber } = params.row
        const isDisabled = !submissionNumber

        const isPdfLoading = downloadLoading[submissionNumber]?.pdf
        const isCsvLoading = downloadLoading[submissionNumber]?.csv

        const handleGroupDownload = async (type: 'pdf' | 'csv') => {
          if (isDisabled) return

          setDownloadLoading((prev) => ({
            ...prev,
            [submissionNumber]: { ...prev[submissionNumber], [type]: true },
          }))

          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/submission-file/group-submission/${submissionNumber}/${type}`
          const filename = `SlabTrak-${submissionNumber}-summary.${type}`

          try {
            // await downloadFile(url, filename)
          } catch (err) {
            console.error(`Failed to download ${type}`, err)
          } finally {
            setDownloadLoading((prev) => ({
              ...prev,
              [submissionNumber]: { ...prev[submissionNumber], [type]: false },
            }))
          }
        }

        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title={isDisabled ? 'No submission number' : 'Download Submission Form'}>
              <span style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}>
                {isPdfLoading ? <CircularProgress size={20} /> : <FaFilePdf size={20} style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => handleGroupDownload('pdf')} />}
              </span>
            </Tooltip>

            <Tooltip title={isDisabled ? 'No submission number' : 'Download Submission CSV'}>
              <span style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}>
                {isCsvLoading ? <CircularProgress size={20} /> : <FaFileCsv size={20} style={{ cursor: 'pointer', color: 'green' }} onClick={() => handleGroupDownload('csv')} />}
              </span>
            </Tooltip>
          </Stack>
        )
      },
    },

    {
      field: 'completed',
      headerName: 'Action ',
      width: 180,
      sortable: false,
      renderCell: (params) => {
        const { status } = params.row

        if (status === 'Shipped' || status === 'shipped') {
          return (
            <Button size="small" variant="contained" onClick={() => onMarkCompletedClick(params.row)}>
              Mark As Completed
            </Button>
          )
        } else if (status === 'completed' || status === 'Completed') {
          return (
            <Button size="small" variant="contained" disabled>
              Completed
            </Button>
          )
        } else {
          return (
            <Button size="small" variant="contained" disabled>
              Mark As Completed
            </Button>
          )
        }
      },
    },
  ]

  return columns
}
