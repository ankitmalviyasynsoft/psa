import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Stack, Button, TextField, Tooltip, CircularProgress } from '@mui/material'
import { GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { useGetAwaitingSubmissionQuery, useGetSubmissionUpdateStatusMutation } from '@/redux/api/getAdminPSASubmissionList.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { style } from './psacustomersubmission.style'
import { Page } from '@/types/page.type'

const AwaitingSubmissions: Page = () => {
  const { paginationModel, setPaginationModel, page, limit } = usePagination()

  const [searchVal, setSearchVal] = useState('')
  const [markingReceived, setMarkingReceived] = useState<{ [uuid: string]: boolean }>({})

  const { data, isLoading, isError, isFetching, refetch } = useGetAwaitingSubmissionQuery({ searchVal, page, limit })

  const [getSubmissionUpdateStatus, { isSuccess }] = useGetSubmissionUpdateStatusMutation()

  useEffect(() => {
    refetch()
  }, [])

  const updateStatus = async (status: any, uuid: string) => {
    setMarkingReceived((prev) => ({ ...prev, [uuid]: true }))
    const payload = {
      orderIdsArray: [uuid],
      submission_number: 0,
      key: status,
    }

    try {
      await getSubmissionUpdateStatus(payload).unwrap()
      refetch()
    } catch (error) {
      console.error('Failed to update status', error)
    } finally {
      setMarkingReceived((prev) => ({ ...prev, [uuid]: false }))
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
      orderID: item.orderCustomer.orderId,
      uuid: item.uuid,
      action: item.status,
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
    { field: 'orderID', headerName: 'Order ID', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) =>
        params.row.receiveddate === 'N/A' && (
          <Button size="small" variant="contained" disabled={markingReceived[params.row.uuid]} onClick={() => updateStatus('received', params.row.uuid)}>
            {markingReceived[params.row.uuid] ? <CircularProgress size={16} color="inherit" /> : 'Mark as Received'}
          </Button>
        ),
    },
  ]

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
    refetch()
  }

  return (
    <>
      <PageHeader title="Awaiting Submissions" />
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

AwaitingSubmissions.layoutProps = {
  title: 'Awaiting Submission',
  pageType: 'protected',
  roles: 'admin',
}

export default AwaitingSubmissions
