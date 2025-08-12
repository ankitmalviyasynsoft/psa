import React, { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './CardsOnSell.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useGetSellOrderItemsQuery, useUpdateOrderItemStatusMutation } from '@/redux/api/cardsBuySell.api'

const CardsOnSell: Page = () => {
  const [searchVal, setSearchVal] = useState('')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetSellOrderItemsQuery({ searchVal, page, limit })
  const [updateOrderItemStatus, { isLoading: isUpdating }] = useUpdateOrderItemStatusMutation()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const updateStatus = async (orderItemId: number, status: string, boughtBy: string) => {
    await updateOrderItemStatus({ orderItemId, status, boughtBy }).unwrap()
    refetch()
  }

  const rows: GridRowsProp =
    data?.result?.map((item: any) => ({
      id: item.id,
      cardName: item.card_name,
      status: item.status,
      name: `${item?.order?.orderCustomer?.firstName || ''} ${item?.order?.orderCustomer?.lastName || ''}`,
      email: item?.order?.orderCustomer?.email || '',
      phone: item?.order?.orderCustomer?.phone || '',
    })) || []

  const columns: GridColDef[] = [
    { field: 'cardName', headerName: 'Card Name', flex: 2 },
    { field: 'name', headerName: 'Customer Name', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'phone', headerName: 'Phone', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <Button size="small" variant="contained" onClick={() => updateStatus(params.row.id, 'sold', 'userId')}>
          Buy
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Buy Cards" />
      <RenderContent loading={isLoading} error={isError}>
        <Stack sx={style.cardStyle} gap={2}>
          <TextField variant="outlined" size="small" placeholder="Search Cards..." value={searchVal} onChange={handleSearchChange} fullWidth />
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

CardsOnSell.layoutProps = {
  title: 'Cards On Sell',
  pageType: 'protected',
  roles: 'admin',
}

export default CardsOnSell
