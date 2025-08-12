import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip, Typography, Stack, Grid2 } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { GridColDef } from '@mui/x-data-grid'
import { MdOutlineDelete, MdAdd, MdOutlineUndo } from 'react-icons/md'
import { LoadingButton } from '@mui/lab'

import RenderContent from '@/components/renderContent/RenderContent.component'
import { useDeleteTempSubmissionMutation, useGetPSACustomerSubmissionQuery, useLazyGetTempSubmissionByIdQuery } from '@/redux/api/getAdminPSASubmissionList.api'

interface tempSubmissionModel {
  openModal: boolean
  onClose: () => void
  selectedTempSubmission: string
  refetch: () => void
}

export const TempSubmissionModal: React.FC<tempSubmissionModel> = ({ openModal, onClose, selectedTempSubmission, refetch }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const page = paginationModel.page + 1
  const limit = paginationModel.pageSize

  const [searchVal, setSearchVal] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<any[]>([])
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [deletedOrders, setDeletedOrders] = useState<any[]>([])

  const [getTempSubmissionById, { data, isFetching, isError }] = useLazyGetTempSubmissionByIdQuery()
  const {
    data: psaData,
    isFetching: psaIsFetching,
    isLoading: psaIsLoading,
    isError: psaIsError,
    refetch: psaRefetch,
  } = useGetPSACustomerSubmissionQuery({ searchVal, page, limit, selectedOrdersId: selectedOrders.map((item) => item.id).join(','), onlySubmissionsAvail: true })

  const [deleteSubmission] = useDeleteTempSubmissionMutation()

  useEffect(() => {
    if (selectedTempSubmission) {
      const id = selectedTempSubmission
      getTempSubmissionById({ id })
    }
    setDeletedOrders([])
    psaRefetch()
  }, [selectedTempSubmission, getTempSubmissionById, openModal])

  useEffect(() => {
    if (data?.orderResult) {
      const formatted = data.orderResult.map((item: any) => ({
        id: item.id,
        uuid: item.uuid,
        t_submission_number: item.t_submission_number,
        name: `${item.orderCustomer.firstName} ${item.orderCustomer.lastName}`,
      }))
      setSelectedOrders(formatted)
    }
  }, [data, openModal])

  useEffect(() => {
    if (psaData?.result) {
      const formatted = psaData.result.map((item: any) => ({
        id: item.id,
        uuid: item.uuid,
        t_submission_number: item.t_submission_number,
        name: `${item.orderCustomer.firstName} ${item.orderCustomer.lastName}`,
      }))

      const filtered = formatted.filter((row: any) => !selectedOrders.some((sel) => sel.id === row.id))

      const merged = [...deletedOrders.filter((deleted) => !filtered.some((row: any) => row.id === deleted.id)), ...filtered]

      setAvailableOrders(merged)
    }
  }, [psaData, selectedOrders, openModal, psaRefetch])

  const handleAdd = (row: any) => {
    setSelectedOrders((prev) => [...prev, row])
    psaRefetch()
  }

  const handleDelete = (row: any) => {
    setSelectedOrders((prev) => prev.filter((item) => item.id !== row.id))
    setDeletedOrders((prev) => [...prev, row])
  }

  const handleUndo = (row: any) => {
    setSelectedOrders((prev) => [...prev, row])
    setDeletedOrders((prev) => prev.filter((item) => item.id !== row.id))
    psaRefetch()
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#Order ID', flex: 1, sortable: false },
    { field: 'name', headerName: 'Customer Name', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete" placement="top">
          <span>
            <MdOutlineDelete size={20} onClick={() => handleDelete(params.row)} style={{ cursor: 'pointer', color: 'red' }} />
          </span>
        </Tooltip>
      ),
    },
  ]

  const columns1: GridColDef[] = [
    { field: 'id', headerName: '#Order ID', flex: 1, sortable: false },
    { field: 'name', headerName: 'Customer Name', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const isDeleted = deletedOrders.some((item) => item.id === params.row.id)
        return (
          <Tooltip title={isDeleted ? 'Undo' : 'Add'} placement="top">
            <span>
              {isDeleted ? (
                <MdOutlineUndo size={20} onClick={() => handleUndo(params.row)} style={{ cursor: 'pointer', color: 'orange' }} />
              ) : (
                <MdAdd size={20} onClick={() => handleAdd(params.row)} style={{ cursor: 'pointer', color: 'green' }} />
              )}
            </span>
          </Tooltip>
        )
      },
    },
  ]

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
    refetch()
  }

  const handleUpdate = async () => {
    const payload = {
      order_ids: selectedOrders.map((item) => item.id).join(','),
      action: 'update',
      t_submission_number: data?.orderResult[0]?.t_submission_number,
    }

    await deleteSubmission(payload).unwrap()
    onClose()
  }

  return (
    <Dialog open={openModal} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Temp Submission : {data?.orderResult[0]?.t_submission_number}</DialogTitle>
      <DialogContent>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography>Selected Orders</Typography>
          <RenderContent loading={isFetching} error={isError}>
            <DataGrid loading={isFetching} columns={columns} rows={selectedOrders} pageSizeOptions={[]} hideFooterPagination={true} disableRowSelectionOnClick={true} disableColumnSorting={true} disableColumnMenu={true} />
          </RenderContent>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack direction={'column'}>
            <Typography>Select Orders</Typography>
            <TextField variant="outlined" size="small" placeholder="Search submissions..." value={searchVal} onChange={handleSearchChange} fullWidth sx={{ marginBottom: '5px' }} />
          </Stack>
          <RenderContent loading={psaIsFetching} error={psaIsError}>
            <DataGrid
              autoHeight
              loading={psaIsFetching}
              columns={columns1}
              rowCount={psaData?.totalItems}
              pageSizeOptions={[10, 25, 50, 100]}
              rows={availableOrders}
              disableRowSelectionOnClick={true}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableColumnSorting={true}
              disableColumnMenu={true}
              paginationMode="server"
            />
          </RenderContent>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" type="submit" onClick={handleUpdate}>
          Update
        </LoadingButton>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TempSubmissionModal
