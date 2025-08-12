import React, { useState } from 'react'
import { Button, CircularProgress, Stack, TextField, Tooltip } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './order.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useGetAllOrderBySubmissionNumberQuery } from '@/redux/api/getAdminPSASubmissionList.api'
import { FaFilePdf } from 'react-icons/fa6'
import { downloadFile } from '@/utils/downloadPdf.util'
import { useMarkOrderDeliveredMutation } from '@/redux/api/createOrder.api'

const PurchasedCards: Page = () => {
  const router = useRouter()
  const submissionNumber = Number(router.query.submissionNumber) || undefined
  const { paginationModel, setPaginationModel, page, limit } = usePagination()

  const [searchVal, setSearchVal] = useState('')
  const [downloadLoading, setDownloadLoading] = useState<{ [orderId: string]: { pdf?: boolean; csv?: boolean } }>({})

  const { data, isLoading, isError, isFetching, refetch } = useGetAllOrderBySubmissionNumberQuery(
    { submissionNumber, searchVal, page, limit },
    {
      skip: !submissionNumber,
    },
  )
  const [markOrderDelivered] = useMarkOrderDeliveredMutation()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const handleMarkDelivered = async (orderId: number) => {
    await markOrderDelivered(orderId).unwrap()
    refetch()
  }

  const rows: GridRowsProp = (data?.result || []).map((order: any) => ({
    id: order.id,
    orderId: order.id,
    customer_name: `${order.orderCustomer.firstName} ${order.orderCustomer.lastName}`,
    customer_phone: order.orderCustomer.phone,
    delivered_to_customer: order.delivered_to_customer,
    status: order.status,
  }))

  const columns: GridColDef[] = [
    { field: 'orderId', headerName: 'Order Id', flex: 1 },
    { field: 'customer_name', headerName: 'Customer Name', flex: 1 },
    { field: 'customer_phone', headerName: 'Phone', flex: 1 },
    {
      field: 'download',
      headerName: 'Download',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const { orderId } = params.row
        const isDisabled = !orderId

        const isPdfLoading = downloadLoading[orderId]?.pdf

        const handlePickupDownload = async (type: 'pdf' | 'csv') => {
          if (isDisabled) return

          setDownloadLoading((prev) => ({
            ...prev,
            [orderId]: { ...prev[orderId], [type]: true },
          }))

          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/submission-file/pickup-confirmation/${orderId}/${type}`
          const filename = `Pickup-Confirmation-${orderId}-.${type}`

          try {
            // await downloadFile(url, filename)
          } catch (err) {
            console.error(`Failed to download ${type}`, err)
          } finally {
            setDownloadLoading((prev) => ({
              ...prev,
              [orderId]: { ...prev[orderId], [type]: false },
            }))
          }
        }

        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title={isDisabled ? 'No submission number' : 'Download PDF'}>
              <span style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}>
                {isPdfLoading ? <CircularProgress size={20} /> : <FaFilePdf size={20} style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => handlePickupDownload('pdf')} />}
              </span>
            </Tooltip>
          </Stack>
        )
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        const { delivered_to_customer, status, id } = params.row

        const isCompleted = String(status).toLowerCase() === 'completed'
        const isDelivered = delivered_to_customer === true

        const disabled = !isCompleted || isDelivered

        return (
          <Button variant="contained" disabled={disabled} onClick={() => handleMarkDelivered(id)}>
            {isDelivered ? 'Delivered' : 'Mark as Delivered'}
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader title="Order List" />
      <RenderContent loading={isLoading} error={isError}>
        <Stack sx={style.cardStyle} gap={2}>
          <TextField variant="outlined" size="small" placeholder="Search Customer..." value={searchVal} onChange={handleSearchChange} fullWidth />
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

PurchasedCards.layoutProps = {
  title: 'Purchased Cards',
  pageType: 'protected',
  roles: 'admin',
}

export default PurchasedCards
