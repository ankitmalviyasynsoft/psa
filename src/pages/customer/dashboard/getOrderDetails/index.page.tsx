import Image from 'next/image'
import { useRouter } from 'next/router'
import { Typography, Box, Button, Stack, Tooltip } from '@mui/material'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './submissionNumber.style'
import { usePagination } from '@/hooks/usePagination.hook'
import { formatDate } from '@/utils/dateFormat.util'
import { useGetOrderDetailsByIdQuery, useGetOrderSubmissionDetailsByIdQuery } from '@/redux/api/getCustomerSubmissionList.api'

const SubmissionDetails = () => {
  const router = useRouter()
  const { type, number, id } = router.query
  const id0 = String(id || '0')
  const id1 = String(number || '0')
  // const shouldSkip = ORDER_ID

  const { paginationModel, setPaginationModel, page, limit } = usePagination()

  const isSubmissionNumber = type === 'submissionNumber'

  const { data, isLoading, isError } = isSubmissionNumber ? useGetOrderSubmissionDetailsByIdQuery({ id: id1, searchVal: '', page, limit }) : useGetOrderDetailsByIdQuery({ id: id0, searchVal: '', page, limit })

  const order = isSubmissionNumber ? data?.result?.[0] : data?.result?.orderDetails
  const orderStatus = order?.orderStatus || []

  const stages = orderStatus.map((status: any) => ({
    label: status.key,
    date: status.date,
  }))

  const rows: GridRowsProp = isSubmissionNumber
    ? data?.result
        ?.map((order: any) =>
          order.orderItems.map((item: any, index: number) => ({
            id: `${order.id}-${index}`,
            card_name: item.card_name || 'N/A',
            grade: order.store?.name || 'N/A',
            cert_number: item.cert_number || 'N/A',
            image_link: item.image_link || null,
            tracking_number: order.tracking_number || 'N/A',
          })),
        )
        .flat() || []
    : data?.result?.orderItems?.map((item: any, index: number) => ({
        id: `${data.result.orderDetails.id}-${index}`,
        card_name: item.card_name || 'N/A',
        grade: data.result.orderDetails.store?.name || 'N/A',
        cert_number: item.cert_number || 'N/A',
        image_link: item.image_link || null,
        tracking_number: data.result.orderDetails.tracking_number || 'N/A',
      })) || []

  const columns: GridColDef[] = [
    { field: 'card_name', headerName: 'Card Details', flex: 1 },
    { field: 'grade', headerName: 'Grade', flex: 1 },
    { field: 'cert_number', headerName: 'Cert Number', flex: 1 },
    {
      field: 'image_link',
      headerName: 'Image Link',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
            {params.value}
          </a>
        ) : (
          'N/A'
        ),
    },
  ]

  return (
    <Stack sx={style.cardStyle}>
      {/* Submission Number */}
      <RenderContent loading={isLoading} error={isError}>
        <Stack direction={'row'}>
          <Typography variant="h3">Submission Number:</Typography>
          <Typography sx={{ color: 'blue' }} variant="h3" component="span">
            {' '}
            {number || 'N/A'}
          </Typography>
        </Stack>
        <Typography variant="subtitle2">
          {isSubmissionNumber ? data?.result?.reduce((acc: number, order: any) => acc + order.orderItems.length, 0) || 0 : data?.result?.orderItems?.length || 0} Item/s - Service Package
        </Typography>

        {/* Submission Timeline */}
        <Stack direction={{ md: 'row', xs: 'column' }} sx={{ overflowX: 'auto', justifyContent: 'space-between' }}>
          {stages.map((stage: any, index: any) => (
            <Stack key={index} alignItems="center">
              {stage.date ? <Image src={'/ok.png'} alt={'ok'} width={40} height={40} /> : <Image src={'/pendingStatus.png'} alt={'ok'} width={40} height={40} />}
              <Typography variant="body2">{stage.label}</Typography>
              <Typography variant="caption">{formatDate(stage.date)}</Typography>
            </Stack>
          ))}
        </Stack>

        {/* Shipping Information */}
        <Box sx={style.track}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <LiaShippingFastSolid />
              <Typography variant="subtitle2">
                Submission shipped back to you. Tracking Number:
                <Typography sx={{ color: 'blue' }} component="span">
                  {''} {order?.tracking_number || 'N/A'}
                </Typography>
              </Typography>
            </Stack>
            <Tooltip title="Track Package">
              <Button
                variant="contained"
                size="small"
                color="error"
                href={order?.shipping_carrier === 'FedEx' ? `https://www.fedex.com/fedextrack/?tracknumbers=${order?.tracking_number || ''}` : 'javascript:void(0)'}
                target="_blank"
              >
                Track Package
              </Button>
            </Tooltip>
          </Stack>
        </Box>

        {/* Card Details */}
        <DataGrid
          autoHeight
          columns={columns}
          rowCount={data?.totalItems}
          pageSizeOptions={[10, 25, 50, 100]}
          rows={rows}
          paginationMode="server"
          disableRowSelectionOnClick={true}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableColumnSorting={true}
          disableColumnMenu={true}
        />
      </RenderContent>
    </Stack>
  )
}

SubmissionDetails.layoutProps = {
  title: 'Submission Details',
  pageType: 'protected',
  roles: 'customer',
}

export default SubmissionDetails
