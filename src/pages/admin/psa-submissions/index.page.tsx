import React, { useState, useEffect } from 'react'
import { Stack } from '@mui/material'
import { GridRowsProp } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import TempSubmissionModal from './components/tempSubmissionModel/tempSubmissionModel.component'
import { useDeleteTempSubmissionMutation, useGetPSASubmissionListQuery, useGetSubmissionUpdateStatusMutation } from '@/redux/api/getAdminPSASubmissionList.api'
import { usePagination } from '@/hooks/usePagination.hook'
import { style } from './psasubmission.style'
import { formatDate } from '@/utils/dateFormat.util'
import { Page } from '@/types/page.type'
import { useColumns } from './psaSubmission.hook'
import { ConfirmDialog } from './components/deleteDialogModal/deleteDialogModel'
import { AdminSubmissionModal } from '../psa-customer-submissions/createOrder/components/adminSubmissionModel/AdminSubmissionModel.component'

const PSASubmission: Page = () => {
  const searchVal = ''
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetPSASubmissionListQuery({ searchVal, page, limit })
  const [deleteSubmission] = useDeleteTempSubmissionMutation()
  const [getSubmissionUpdateStatus] = useGetSubmissionUpdateStatusMutation()

  const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [selectedTempSubmission, setSelectedTempSubmission] = useState<string>('')
  const [selectedTempSubmission1, setSelectedTempSubmission1] = useState<string>('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)

  const [IstempSubmissionModal, setTempSubmissionModalOpen] = useState(false)

  useEffect(() => {
    refetch()
  }, [])

  const rows: GridRowsProp =
    data?.result?.map((item: any, index: number) => ({
      id: index,
      submissionNumber: item.submission_number,
      status: item.status,
      count: item.count,
      submission_status: item.submission_status,
      uuid: item.uuid,
      order_ids: item.order_ids,
      t_submission_number: item.t_submission_number ? item.t_submission_number : 'N/A',
      shippedDate: formatDate(item?.orderStatus?.find((statusItem: any) => statusItem.status === 'sent-to-psa')?.date) || null,
      arrivedToPSA: formatDate(item?.orderStatus?.find((statusItem: any) => statusItem.status === 'Arrived')?.date) || null,
      arrivedBack: formatDate(item?.orderStatus?.find((statusItem: any) => statusItem.status === 'Shipped')?.date) || null,
    })) || []

  const handleOpenModal = (tSubmissionNumber: string) => {
    setSelectedTempSubmission(tSubmissionNumber.toString())
    setSubmissionModalOpen(true)
  }

  const handleEditClick = (tSubmissionNumber: string) => {
    setSelectedTempSubmission1(tSubmissionNumber)
    setTempSubmissionModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return
    await deleteSubmission({ t_submission_number: selectedRow.t_submission_number, action: 'delete' }).unwrap()
    setConfirmOpen(false)
    setSelectedRow(null)
  }

  const handleUnpublishedClick = async (tSubmissionNumber: string) => {
    await deleteSubmission({ t_submission_number: tSubmissionNumber, action: 'unpublish' }).unwrap()
    refetch()
  }

  const handleMarkCompleted = async (row: any) => {
    const { order_ids, submissionNumber } = row

    const orderIdsArray = order_ids.split(',')
    const payload = {
      orderIdsArray,
      submission_number: submissionNumber,
      key: 'completed',
    }

    await getSubmissionUpdateStatus(payload).unwrap()

    refetch()
  }

  const handleCloseModal = () => setSubmissionModalOpen(false)

  const handleCloseTempModal = () => setTempSubmissionModalOpen(false)

  const columns = useColumns({
    onPublishClick: handleOpenModal,
    onEditClick: handleEditClick,
    onDeleteClick: (row) => {
      setSelectedRow(row)
      setConfirmOpen(true)
    },
    onUnpublishedClick: handleUnpublishedClick,
    onMarkCompletedClick: handleMarkCompleted,
  })

  return (
    <>
      <PageHeader title="PSA Submissions" />
      <RenderContent loading={isLoading} error={isError}>
        <Stack sx={style.cardStyle}>
          <DataGrid
            autoHeight
            loading={isFetching}
            columns={columns}
            rowCount={data?.totalItems}
            rows={rows}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationMode="server"
            disableRowSelectionOnClick={true}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableColumnSorting={true}
            disableColumnMenu={true}
          />
        </Stack>
      </RenderContent>
      <AdminSubmissionModal refetch={refetch} openModal={isSubmissionModalOpen} onClose={handleCloseModal} selectedTempSubmission={selectedTempSubmission} />
      <TempSubmissionModal refetch={refetch} openModal={IstempSubmissionModal} onClose={handleCloseTempModal} selectedTempSubmission={selectedTempSubmission1} />
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDeleteConfirm} message="Are you sure you want to delete this submission?" />
    </>
  )
}

PSASubmission.layoutProps = {
  title: 'PSA Submission',
  pageType: 'protected',
  roles: 'admin',
}

export default PSASubmission
