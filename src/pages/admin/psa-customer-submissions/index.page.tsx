import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Box, Stack, Button, Checkbox, TextField, Dialog, DialogContent, DialogActions, Typography, Tooltip, CircularProgress } from '@mui/material'
import { GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { FiFolderPlus } from 'react-icons/fi'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { useCreateTempSubmissionMutation, useGetPSACustomerSubmissionQuery } from '@/redux/api/getAdminPSASubmissionList.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { useLazyGetStoreDetailsByIdQuery } from '@/redux/api/store.api'
import { setStoreData } from '@/redux/slice/selectedStore'
import { style } from './psacustomersubmission.style'
import { Page } from '@/types/page.type'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { createNewSubmission, resetNewSubmission } from '@/redux/slice/newSubmission.slice'
import { resetCustomerProfile } from '@/redux/slice/customerProfile.slice'
import { MdOutlinePrint } from 'react-icons/md'
import { downloadFile } from '@/utils/downloadPdf.util'

const PSACustomerSubmissions: Page = () => {
  const router = useRouter()
  const dispatch = useReduxDispatch()
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const storeOwnerprofile = useReduxSelector((state) => state?.profile?.profile?.store)

  const [searchVal, setSearchVal] = useState('')
  const [selectedOrderIds, setSelectedOrderIds] = useState<any>([])
  const [rowLoading, setRowLoading] = useState<{ [orderId: number]: boolean }>({})
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const { data, isLoading, isError, isFetching, refetch } = useGetPSACustomerSubmissionQuery({ searchVal, page, limit })
  const [getStoreDetailsById] = useLazyGetStoreDetailsByIdQuery()
  const [createTempSubmission] = useCreateTempSubmissionMutation()

  useEffect(() => {
    refetch()
  }, [])

  // const handleDownload = async (orderId: number) => {
  //   setRowLoading((prev) => ({ ...prev, [orderId]: true }))

  //   const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/submission-file/submission-pdf/${orderId}/pdf`
  //   const filename = `order-${orderId}.pdf`
  //   await downloadFile(url, filename)
  //   setRowLoading((prev) => ({ ...prev, [orderId]: false }))
  // }

  const handleDownload = async (orderId: number) => {
    setRowLoading((prev) => ({ ...prev, [orderId]: true }))

    try {
      // 1. Get HTML from backend
      const pdfurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/submission-file/submission-pdf/${orderId}/pdf`
      const html = await downloadFile(pdfurl)

      // 2. Send HTML to PDF generator API
      const response = await fetch('/api/generate-pdf/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }), // raw HTML, no encode/decode
      })

      console.log('response 67', response)

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // 3. Get PDF blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `order-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      console.log(err)

      alert('Something went wrong while generating PDF')
    } finally {
      setRowLoading((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const rows: GridRowsProp =
    data?.result?.map((item: any) => ({
      id: item.id,
      submissiondate: item.submission_date ? moment(item.submission_date).format('DD-MM-YYYY') : 'N/A',
      receiveddate: item.received_date ? moment(item.received_date).format('DD-MM-YYYY') : 'N/A',
      name: `${item.orderCustomer.firstName} ${item.orderCustomer.lastName}`,
      createddate: item.createdAt ? moment(item.createdAt).format('DD-MM-YYYY') : 'N/A',
      quantity: item.orderItems.length,
      submissionNumber: item.submission_number || 'N/A',
      t_submission_number: item.t_submission_number || 'N/A',
      orderID: item.orderCustomer.orderId,
      uuid: item.uuid,
      group: item.status,
    })) || []

  const columns: GridColDef[] = [
    {
      field: 'submissiondate',
      headerName: 'Date Submitted',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => value || 'N/A',
    },
    {
      field: 'receiveddate',
      headerName: 'Date Received',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => value || 'N/A',
    },
    { field: 'name', headerName: 'Customer Name', flex: 1, sortable: false },
    {
      field: 'createddate',
      headerName: 'Date Created',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => value || 'N/A',
    },
    { field: 'quantity', headerName: 'No. Items', flex: 1, sortable: false },
    { field: 'submissionNumber', headerName: 'Submission Number', flex: 1, sortable: false },
    { field: 't_submission_number', headerName: 'Temporary Submission Number', flex: 1, sortable: false },
    { field: 'orderID', headerName: 'Order ID', flex: 1, sortable: false },
    {
      field: 'group',
      headerName: 'Group',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const hasSubmissionNumber = params.row.submissionNumber !== 'N/A'
        const hasReceivedDate = params.row.receiveddate !== 'N/A'
        const hasTemprorayNumber = params.row.t_submission_number !== 'N/A'
        const isChecked = selectedOrderIds.includes(params.row.uuid)

        const shouldDisable = hasSubmissionNumber || hasTemprorayNumber || (!hasSubmissionNumber && !hasReceivedDate)
        const finalChecked = hasSubmissionNumber || hasTemprorayNumber || (isChecked && !(!hasSubmissionNumber && !hasReceivedDate))

        return !hasReceivedDate ? (
          <Tooltip title={'Please mark as received'}>
            <span>
              <Checkbox checked={finalChecked} disabled={shouldDisable} onChange={() => handleCheckboxChange(params.row.uuid)} />
            </span>
          </Tooltip>
        ) : (
          <Checkbox checked={finalChecked} disabled={shouldDisable} onChange={() => handleCheckboxChange(params.row.uuid)} />
        )
      },
    },
    {
      field: 'download',
      headerName: 'Download',
      sortable: false,
      width: 100,
      renderCell: (params) =>
        rowLoading[params.row.orderID] ? (
          <CircularProgress size={20} />
        ) : (
          <Tooltip title="Print Submission">
            <span>
              <MdOutlinePrint size={20} style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDownload(params.row.orderID)} />
            </span>
          </Tooltip>
        ),
    },
  ]

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false)
    setAlertMessage(null)
  }

  const handleCreateSubmission = async () => {
    if (selectedOrderIds.length <= 0) {
      setAlertMessage('First Select a submission')
      setAlertDialogOpen(true)
      return
    }
    const payload = {
      orderIdsArray: selectedOrderIds,
      key: 'Draft',
    }
    await createTempSubmission(payload).unwrap()
    refetch()
  }

  const handleCheckboxChange = async (uuid: string) => {
    setSelectedOrderIds((prev: string[]) => (prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
    refetch()
  }

  const getStoreData = async () => {
    if (storeOwnerprofile?.id) {
      const getStoreDetailsById1 = await getStoreDetailsById(storeOwnerprofile?.userId).unwrap()

      dispatch(resetCustomerProfile())
      localStorage.setItem('storeData', JSON.stringify(getStoreDetailsById1?.result))

      dispatch(setStoreData(getStoreDetailsById1?.result))
      dispatch(resetNewSubmission())

      router.push('/admin/psa-customer-submissions/createOrder')
    }
  }

  return (
    <>
      <PageHeader
        title="PSA Customer Submissions"
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button size="small" variant="contained" onClick={getStoreData}>
              <FiFolderPlus size={20} style={{ marginRight: 8 }} />
              Create Order
            </Button>
            {data?.totalItems !== 0 && (
              <>
                <Button size="small" variant="contained" onClick={handleCreateSubmission}>
                  <FiFolderPlus size={20} style={{ marginRight: 8 }} />
                  Create Draft Submission
                </Button>
              </>
            )}
          </Box>
        }
      />
      <Dialog open={alertDialogOpen} onClose={handleAlertDialogClose}>
        <DialogContent>
          <Typography>{alertMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" onClick={handleAlertDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <RenderContent loading={isLoading} error={isError}>
        <Stack sx={style.cardStyle} gap={2}>
          <TextField variant="outlined" size="small" placeholder="Search submissions..." value={searchVal} onChange={handleSearchChange} fullWidth />
          <DataGrid
            autoHeight
            loading={isFetching}
            columns={columns}
            rowCount={data?.totalItems}
            pageSizeOptions={[10, 25, 50, 100]}
            rows={rows}
            disableRowSelectionOnClick={true}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableColumnSorting={true}
            disableColumnMenu={true}
            paginationMode="server"
          />
        </Stack>
      </RenderContent>
    </>
  )
}

PSACustomerSubmissions.layoutProps = {
  title: 'PSA Customer Submission',
  pageType: 'protected',
  roles: 'admin',
}

export default PSACustomerSubmissions
