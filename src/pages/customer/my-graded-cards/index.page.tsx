import React, { useState } from 'react'
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { FaListUl } from 'react-icons/fa'
import { TbLayoutGridFilled } from 'react-icons/tb'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import CardInformation from './components/CardInformationModal'
import { style } from './purchasedCard.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useGetCustomerPurchaseOrderItemsQuery } from '@/redux/api/cardsBuySell.api'
import { dummyData } from './dummyData'

const GradedCards: Page = () => {
  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetCustomerPurchaseOrderItemsQuery({ page, limit })
  const [view, setView] = useState<'list' | 'grid'>('grid')
  const [isCardInformationOpen, setIsCardInformationOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<any>(null)

  const handleViewChange = (_: any, newView: 'list' | 'grid') => {
    if (newView) setView(newView)
  }

  const handleOpenModal = (card: any) => {
    setSelectedCard(card)
    setIsCardInformationOpen(true)
  }

  const handleCloseModal = () => {
    setIsCardInformationOpen(false)
    setSelectedCard(null)
  }

  const rows: GridRowsProp = []

  const columns: GridColDef[] = [
    { field: 'cert_number', headerName: 'Cert#', flex: 2 },
    { field: 'psaLink', headerName: 'PSA Link', flex: 2 },
    { field: 'cardName', headerName: 'Card Name', flex: 2 },
    { field: 'grade', headerName: 'Grade', flex: 2 },
    { field: 'image_link', headerName: 'Image', flex: 2 },
  ]

  return (
    <>
      <PageHeader
        title="My Graded Cards"
        action={
          <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
            <ToggleButton value="list">
              <FaListUl size={24} />
            </ToggleButton>
            <ToggleButton value="grid">
              <TbLayoutGridFilled size={24} />
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <RenderContent loading={isLoading} error={isError}>
        {view === 'list' ? (
          <Stack sx={style.cardStyle} gap={2}>
            <DataGrid
              autoHeight
              loading={isFetching}
              columns={columns}
              rowCount={dummyData?.totalItems}
              pageSizeOptions={[10, 25, 50, 100]}
              rows={rows}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableColumnSorting
              disableColumnMenu
              paginationMode="server"
            />
          </Stack>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {dummyData.items.map((card) => {
              const frontImage = card.image_link.find((img) => img.IsFrontImage)?.ImageURL
              return (
                <Box key={card.id} border="1px solid #ccc" borderRadius={2} width={300} p={1} textAlign="center">
                  <img src={frontImage} alt={card.cardName} style={{ width: '100%' }} />
                  <Typography variant="body2" mt={1}>
                    {card.cardName}
                  </Typography>
                  <Button variant="contained" color="primary" size="small" fullWidth style={{ marginTop: '8px' }} onClick={() => handleOpenModal(card)}>
                    More Info
                  </Button>
                </Box>
              )
            })}
          </Box>
        )}
      </RenderContent>
      {/* Modal Component */}
      <CardInformation openModal={isCardInformationOpen} onClose={handleCloseModal} data={selectedCard} />
    </>
  )
}

GradedCards.layoutProps = {
  title: 'Graded Cards',
  pageType: 'protected',
  roles: 'customer',
}

export default GradedCards
