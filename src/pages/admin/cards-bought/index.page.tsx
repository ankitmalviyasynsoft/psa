import React, { useState } from 'react'
import { Stack, TextField } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './PurchasedCards.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useGetRetailorPurchaseOrderItemsQuery } from '@/redux/api/cardsBuySell.api'

const PurchasedCards: Page = () => {
  const [searchVal, setSearchVal] = useState('')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching } = useGetRetailorPurchaseOrderItemsQuery({ searchVal, page, limit })

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const rows: GridRowsProp =
    data?.result?.map((item) => ({
      id: item.id,
      cardName: item.card_name,
      status: item.status,
    })) || []

  const columns: GridColDef[] = [
    { field: 'cardName', headerName: 'Card Name', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 2 },
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
  roles: 'admin',
}

export default PurchasedCards
