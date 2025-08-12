import React, { useState } from 'react'
import Grid from '@mui/material/Grid2'
import { useRouter } from 'next/router'
import { Typography, Stack, TextField, Button } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './submissionUpdate.style'
import { useGetSubmissionDetailsByIdQuery } from '@/redux/api/getAdminPSASubmissionList.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { formatDate } from '@/utils/dateFormat.util'
import { Page } from '@/types/page.type'
import { AddUpchanrgeModal } from '../components/addUpcharge/addUpchargeModal'

const SubmissionUpdate: Page = () => {
  const router = useRouter()
  const { number } = router.query
  const id = String(number || '0')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, refetch } = useGetSubmissionDetailsByIdQuery({ id, searchVal: '', page, limit })
  const [isUpchargeModalOpen, setUpchargeModalOpen] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState<string>('')
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0)

  const handleCloseModal = () => setUpchargeModalOpen(false)

  const statusMap = {
    arrivedToPsa: 'Arrived PSA',
    dateShipped: 'Shipping/Collection',
    sentToPsa: 'Sent To PSA',
  }

  const statusDates = Object.entries(statusMap).reduce(
    (acc, [fieldKey, statusKey]) => {
      const matchedStatus = data?.statusDetails?.orderStatus?.find((status: any) => status.key === statusKey)
      acc[fieldKey] = matchedStatus?.date || 'N/A'
      return acc
    },
    {} as Record<string, string>,
  )

  const rows: GridRowsProp =
    data?.orderResult?.result?.map((item: any) => {
      return {
        id: item.id,
        orderId: item.orderId,
        customerName: `${item.order.orderCustomer.firstName} ${item.order.orderCustomer.lastName}`,
        card_name: item.card_name,
        grade: item.grade || 'N/A',
        cert_number: item.cert_number || 'N/A',
        declared_value: `${item.declared_value} ${' '} ${item.order.currency_symbol}` || 'N/A',
        upcharge_amount: `${item.upcharge_amount ? `${item.upcharge_amount} ${' '}  ${item.order.currency_symbol}` : 'N/A'}`,
        upcharge_status: item.upcharge_status || 'N/A',
      }
    }) || []

  const columns: GridColDef[] = [
    { field: 'orderId', headerName: '#Order ID', flex: 1, sortable: false },
    { field: 'customerName', headerName: 'Customer Name', flex: 1, sortable: false },
    { field: 'card_name', headerName: 'Card Name', flex: 1, sortable: false },
    { field: 'grade', headerName: 'Grade', flex: 1, sortable: false },
    { field: 'declared_value', headerName: 'Declared value', flex: 1, sortable: false },
    { field: 'cert_number', headerName: 'Cert Number', flex: 1, sortable: false },
    { field: 'upcharge_status', headerName: 'Upcharge Status', flex: 1, sortable: false },
    { field: 'upcharge_amount', headerName: 'Upcharge Amount', flex: 1, sortable: false },
    {
      field: 'group',
      headerName: 'Group',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          disabled={params.row.upcharge_status == 'paid'}
          size="small"
          variant="contained"
          onClick={() => {
            setSelectedOrderId(params.row.orderId)
            setSelectedOrderItem(params.row.id)
            setUpchargeModalOpen(true)
          }}
        >
          Add Upcharge
        </Button>
      ),
    },
  ]

  return (
    <Stack sx={style.cardStyle}>
      {/* Submission Number */}
      <RenderContent loading={isLoading} error={isError}>
        <Typography variant="h3" mb={2}>
          Submission Number:
          <Typography sx={{ color: 'blue' }} variant="h3" component="span">
            {' '}
            {number}
          </Typography>
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField label="Status" value={data?.statusDetails?.status || 'N/A'} disabled />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField label="Date Shipped" value={formatDate(statusDates.sentToPsa) || 'N/A'} disabled />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField label="Arrived To PSA" value={formatDate(statusDates.arrivedToPsa) || 'N/A'} disabled />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField label="Arrived Back" value={formatDate(statusDates.shipped) || 'N/A'} disabled />
          </Grid>
        </Grid>
        <DataGrid
          autoHeight
          columns={columns}
          rowCount={data?.orderResult?.totalItems || 0}
          rows={rows}
          disableRowSelectionOnClick={true}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableColumnSorting={true}
          disableColumnMenu={true}
          paginationMode="server"
        />
      </RenderContent>
      <AddUpchanrgeModal
        refetch={refetch}
        openModal={isUpchargeModalOpen}
        onClose={handleCloseModal}
        selectedOrderItem={selectedOrderItem}
        selectedOrderId={selectedOrderId}
        currency_symbol={data?.statusDetails?.currency_symbol}
      />
    </Stack>
  )
}

SubmissionUpdate.layoutProps = {
  title: 'Submission Update',
  pageType: 'protected',
  roles: 'admin',
}

export default SubmissionUpdate
