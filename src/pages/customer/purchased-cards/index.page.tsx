import React, { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './purchasedCard.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useGetCustomerPurchaseOrderItemsQuery, useUpdateOrderItemStatusMutation } from '@/redux/api/cardsBuySell.api'

const PurchasedCards: Page = () => {
  const [searchVal, setSearchVal] = useState('')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetCustomerPurchaseOrderItemsQuery({ searchVal, page, limit })
  const [updateOrderItemStatus, { isLoading: isUpdating }] = useUpdateOrderItemStatusMutation()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const updateStatus = async (orderItemId: number, status: string) => {
    await updateOrderItemStatus({ orderItemId, status }).unwrap()
    refetch()
  }

  const rows: GridRowsProp =
    data?.result?.map((item) => ({
      id: item.id,
      cardName: item.card_name,
      status: item.status,
    })) || []

  const columns: GridColDef[] = [
    { field: 'cardName', headerName: 'Card Name', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => {
        const { status, id } = params.row

        if (status === 'pending') {
          return (
            <Button size="small" variant="contained" disabled={isUpdating} onClick={() => updateStatus(id, 'sell')}>
              Sell
            </Button>
          )
        } else if (status === 'sell') {
          return (
            <Button size="small" variant="outlined" color="warning" disabled={isUpdating} onClick={() => updateStatus(id, 'pending')}>
              Undo
            </Button>
          )
        } else if (status === 'sold') {
          return (
            <Button size="small" variant="contained" color="success" disabled>
              SOLD
            </Button>
          )
        }

        return null
      },
    },
  ]

  return (
    <>
      <PageHeader title="Purchased Cards" />
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

PurchasedCards.layoutProps = {
  title: 'Purchased Cards',
  pageType: 'protected',
  roles: 'customer',
}

export default PurchasedCards
