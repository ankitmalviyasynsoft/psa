import React, { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './storeList.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useApproveRetailerMutation, useGetUnapprovedRetailerListQuery } from '@/redux/api/superAdmin.api'

const UnapprovedRetailer: Page = () => {
  const [searchVal, setSearchVal] = useState('')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetUnapprovedRetailerListQuery({ searchVal, page, limit })
  const [approveRetailer] = useApproveRetailerMutation()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const handleApprove = async (userId: number) => {
    await approveRetailer(userId).unwrap()
    refetch()
  }

  const rows: GridRowsProp =
    data?.result?.map((item: any, index: number) => ({
      id: item.id,
      rowId: index + 1,
      name: item.firstName + ' ' + item.lastName,
      email: item.email,
      phone: item.phone,
      address_1: item.userDetails?.address_1,
      city: item.userDetails?.city,
      state: item.userDetails?.state,
    })) || []

  const columns: GridColDef[] = [
    { field: 'rowId', headerName: '#', flex: 1, sortable: false },
    { field: 'name', headerName: 'Name', flex: 1, sortable: false },
    { field: 'email', headerName: 'Email', flex: 1, sortable: false },
    { field: 'phone', headerName: 'Phone', flex: 1, sortable: false },
    { field: 'address_1', headerName: 'Address', flex: 1, sortable: false },
    { field: 'city', headerName: 'City', flex: 1, sortable: false },
    { field: 'state', headerName: 'State', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" variant="contained" onClick={() => handleApprove(params.row.id)}>
          Approve
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Unapproved Retailer" />
      <RenderContent loading={isLoading} error={isError}>
        <Stack sx={style.cardStyle} gap={2}>
          <TextField variant="outlined" size="small" placeholder="Search Retailer..." value={searchVal} onChange={handleSearchChange} fullWidth />
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

UnapprovedRetailer.layoutProps = {
  title: 'Admin | Unapproved Stores',
  pageType: 'protected',
  roles: 'superAdmin',
}

export default UnapprovedRetailer
