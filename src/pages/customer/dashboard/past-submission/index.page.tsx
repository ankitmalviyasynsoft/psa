import Image from 'next/image'
import { Button, Stack, Typography } from '@mui/material'
import { GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { DataGrid } from '@mui/x-data-grid'

import EmptyState from '@/../public/empty_state/No_Files.svg'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { useGetOrderListQuery } from '@/redux/api/getCustomerSubmissionList.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { formatDate } from '@/utils/dateFormat.util'
import { style } from './pastSubmission.style'

const PastSubmission = () => {
  const router = useRouter()
  const searchVal = ''

  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError } = useGetOrderListQuery({ searchVal, page, limit })

  const handleCellClick = (param: string, isSubmissionNumber: boolean) => {
    const query = isSubmissionNumber ? { number: param, type: 'submissionNumber' } : { id: param, type: 'id' }

    router.push({ pathname: '/customer/dashboard/getOrderDetails', query })
  }

  const handleEditClick = (row: any) => {
    const { slug, orderId } = row
    window.location.href = `/customer/dashboard/new-submission/${slug}?ORDER_ID=` + orderId
  }

  const rows: GridRowsProp =
    data?.result?.map((item: any, index: number) => ({
      id: item.id,
      orderId: item.id,
      orderDate: formatDate(item.createdAt),
      gradingCompany: item?.store?.name,
      slug: item?.store?.slug,
      status: item.status,
      submissionNumber: item.submission_number || 'Pending',
      submissionDate: formatDate(item.submission_date) || 'N/A',
      cardReceived: item.received_date ? 'Received' : 'Not Received',
      viewOrder: item.id,
    })) || []

  const columns: GridColDef[] = [
    { field: 'orderId', headerName: 'Order Id', flex: 1, sortable: false },
    { field: 'orderDate', headerName: 'Date Created', flex: 1, sortable: false },
    { field: 'gradingCompany', headerName: 'Grading Company', flex: 1, sortable: false },
    { field: 'status', headerName: 'Status', flex: 1, sortable: false },
    {
      field: 'submissionNumber',
      headerName: 'Submission Number',
      flex: 1,
      sortable: false,
      renderCell: (params) =>
        params.value === 'Pending' ? (
          <span style={{ cursor: 'default' }}>{params.value}</span>
        ) : (
          <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={() => handleCellClick(params.row.submissionNumber, true)}>
            {params.value}
          </span>
        ),
    },
    { field: 'submissionDate', headerName: 'Submission Date', flex: 1, sortable: false },
    { field: 'cardReceived', headerName: 'Card Received', flex: 1, sortable: false },
    {
      field: 'viewOrder',
      headerName: 'View Order',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" size="small" color="success" onClick={() => handleCellClick(params.row.id, false)}>
          View
        </Button>
      ),
    },
    {
      field: 'editOrder',
      headerName: 'Edit Order',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button disabled={params.row.status != 'draft'} variant="contained" size="small" onClick={() => handleEditClick(params.row)}>
          Edit
        </Button>
      ),
    },
  ]

  return (
    <RenderContent loading={isLoading} error={isError}>
      <Stack sx={style.cardStyle}>
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          rowCount={data?.totalItems || 0}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick={true}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableColumnSorting={true}
          disableColumnMenu={true}
          paginationMode="server"
        />
      </Stack>
    </RenderContent>
  )
}

PastSubmission.layoutProps = {
  title: 'Past Submission',
  pageType: 'protected',
  roles: 'customer',
}

export default PastSubmission
