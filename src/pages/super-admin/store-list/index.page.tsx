import React, { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import { style } from './storeList.style'
import { Page } from '@/types/page.type'
import { useGetRetailerListQuery } from '@/redux/api/superAdmin.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { useLazyGetImpersonateLoginTokenQuery } from '@/redux/api/superAdmin.api'
import { setUser } from '@/pages/auth/Auth.util'
import { getCookie } from '@/utils/cookie.util'

const StoreList: Page = () => {
  const token = getCookie('token')
  const [searchVal, setSearchVal] = useState('')
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching } = useGetRetailerListQuery({ searchVal, page, limit })
  const [getImpersonateLoginToken] = useLazyGetImpersonateLoginTokenQuery()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const loginAsRetailer = async (userId: string) => {
    const response = await getImpersonateLoginToken(userId).unwrap()
    localStorage.setItem('impersonatedToken', token)
    if (response.statusCode === 200) {
      setUser(response.result)
      window.location.href = '/'
    }
  }

  const rows: GridRowsProp =
    data?.result.map((item: any, index: any) => ({
      rowId: paginationModel.page * paginationModel.pageSize + index + 1,
      name: item.firstName + ' ' + item.lastName,
      email: item.email,
      phone: item.phone,
      address_1: item.userDetails?.address_1,
      city: item.userDetails?.city,
      state: item.userDetails?.state,
      id: item.id,
    })) || []

  const columns: GridColDef[] = [
    { field: 'rowId', headerName: '#', flex: 1, sortable: false },
    { field: 'name', headerName: 'Retailor Name', flex: 1, sortable: false },
    { field: 'email', headerName: 'Email', flex: 1, sortable: false },
    { field: 'phone', headerName: 'Phone Number', flex: 1, sortable: false },
    { field: 'address_1', headerName: 'Address', flex: 1, sortable: false },
    { field: 'city', headerName: 'City', flex: 1, sortable: false },
    { field: 'state', headerName: 'State', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" variant="contained" onClick={() => loginAsRetailer(params.row.id)}>
          Login As Retailer
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="All Stores" />
      <RenderContent loading={isLoading} error={isError}>
        <Stack sx={style.cardStyle} gap={2}>
          <TextField variant="outlined" size="small" placeholder="Search Store..." value={searchVal} onChange={handleSearchChange} fullWidth />
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

StoreList.layoutProps = {
  title: 'Admin | Store List',
  pageType: 'protected',
  roles: 'superAdmin',
}

export default StoreList
