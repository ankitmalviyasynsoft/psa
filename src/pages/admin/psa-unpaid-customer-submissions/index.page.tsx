import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Stack, Button, TextField } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { useGetPSACustomerSubmissionQuery, useUpdatePaymentStatusMutation } from '@/redux/api/getAdminPSASubmissionList.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { style } from './psacustomerunpaidsubmission.style'
import { Page } from '@/types/page.type'

const PSACustomerSubmissions: Page = () => {
  const payment_status = 'unpaid'
  const payment_method = 'bankTransfer'
  const [searchVal, setSearchVal] = useState('')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetPSACustomerSubmissionQuery({ searchVal, page, limit, payment_status, payment_method })
  const [updatePaymentStatusApi] = useUpdatePaymentStatusMutation()

  useEffect(() => {
    refetch()
  }, [])

  const updatePaymentStatus = async (uuid: string) => {
    await updatePaymentStatusApi({ uuid }).unwrap()
    refetch()
  }

  const rows: GridRowsProp =
    data?.result?.map((item: any) => ({
      id: item.id,
      submissiondate: item.submission_date ? moment(item.submission_date).format('DD-MM-YYYY') : 'N/A',
      receiveddate: item.received_date ? moment(item.received_date).format('DD-MM-YYYY') : 'N/A',
      name: `${item.orderCustomer.firstName} ${item.orderCustomer.lastName}`,
      createdDate: item.createdAt ? moment(item.createdAt).format('DD-MM-YYYY') : 'N/A',
      quantity: item.orderItems.length,
      submissionNumber: item.submission_number || 'N/A',
      orderID: item.orderCustomer.orderId,
      uuid: item.uuid,
      group: item.status,
    })) || []

  const columns: GridColDef[] = [
    { field: 'submissiondate', headerName: 'Date Submitted', flex: 1, sortable: false, renderCell: ({ value }) => value || 'N/A' },
    { field: 'receiveddate', headerName: 'Date Received', flex: 1, sortable: false, renderCell: ({ value }) => value || 'N/A' },
    { field: 'name', headerName: 'Customer Name', flex: 1, sortable: false },
    { field: 'createdDate', headerName: 'Date Created', flex: 1, sortable: false },
    { field: 'quantity', headerName: 'No. Items', flex: 1, sortable: false },
    { field: 'submissionNumber', headerName: 'Submission Number', flex: 1, sortable: false },
    { field: 'orderID', headerName: 'Order ID', flex: 1, sortable: false },
    {
      field: 'group',
      headerName: 'Group',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" variant="contained" onClick={() => updatePaymentStatus(params.row.uuid)}>
          Mark as paid
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
      <PageHeader title="PSA Customer Unpaid Submissions" />
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
  title: 'PSA Customer Unpaid Submission',
  pageType: 'protected',
  roles: 'admin',
}

export default PSACustomerSubmissions
