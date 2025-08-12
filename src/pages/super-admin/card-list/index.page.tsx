import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { DataGrid, GridRowsProp } from '@mui/x-data-grid'
import { MdOutlineDelete } from 'react-icons/md'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import RenderContent from '@/components/renderContent/RenderContent.component'
import EditCardModal from './components/EditCardModal'
import { style } from './cardList.style'
import { Page } from '@/types/page.type'
import { usePagination } from '@/hooks/usePagination.hook'
import { useDeleteCardsMutation, useGetCardListQuery, useGetExpansionsListQuery, useGetGameListQuery, useGetRarityListQuery } from '@/redux/api/card.api'
import { CardDTO } from '@/dto/Card.dto'
import { ConfirmDialog } from '@/pages/admin/psa-submissions/components/deleteDialogModal/deleteDialogModel'
import { useCardListColumns } from './cardList.hook'

const CardList: Page = () => {
  const [searchVal, setSearchVal] = useState('')
  const [selectedCard, setSelectedCard] = useState<CardDTO>()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState('')
  const [selectedExpansion, setSelectedExpansion] = useState('')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [selectedRarity, setSelectedRarity] = useState<string>('')

  const [deleteCards] = useDeleteCardsMutation()

  const { paginationModel, setPaginationModel, page, limit } = usePagination()
  const { data, isLoading, isError, isFetching, refetch } = useGetCardListQuery({ searchVal, page, limit, game_title: selectedGame, expansion: selectedExpansion, rarity: selectedRarity }, { refetchOnMountOrArgChange: true })
  const { data: gameTitles, isLoading: isGamesLoading } = useGetGameListQuery()
  const { data: rarityList, isLoading: isRarityLoading } = useGetRarityListQuery()

  const { data: expansions, isLoading: isExpansionsLoading } = useGetExpansionsListQuery()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value)
  }

  const handleConfirmDelete = async () => {
    if (selectedRows.length === 0) return
    await deleteCards(selectedRows).unwrap()
    setSelectedRows([])
    refetch()
    setIsDeleteDialogOpen(false)
  }

  const rows: GridRowsProp =
    data?.result.map((item) => ({
      id: item.id,
      uid: item.uid || 'N/A',
      title: item.title,
      game_title: item.game_title || 'N/A',
      expansion: item.expansion || 'N/A',
      rarity: item.rarity || 'N/A',
      number: item.number || 'N/A',
      year: item.year || 'N/A',
      image_link: item.image_link || null,
      abbreviation: item.abbreviation || 'N/A',
    })) || []

  const columns = useCardListColumns({
    onEditClick: (card) => {
      setSelectedCard(card)
      setIsEditOpen(true)
    },
  })

  useEffect(() => {
    refetch()
  }, [])

  return (
    <>
      <PageHeader title="Card List" />
      <RenderContent loading={isLoading || isGamesLoading || isRarityLoading} error={isError}>
        <Stack sx={style.cardStyle} gap={2}>
          {selectedRows.length > 0 ? (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="error" onClick={() => setIsDeleteDialogOpen(true)} startIcon={<MdOutlineDelete size={20} />}>
                Delete Selected ({selectedRows.length})
              </Button>
            </Stack>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    select
                    size="small"
                    label="Select Game"
                    value={selectedGame}
                    onChange={(e) => {
                      setSelectedGame(e.target.value)
                    }}
                    fullWidth
                  >
                    {gameTitles && gameTitles.length > 0 ? (
                      gameTitles.map((game) => (
                        <MenuItem key={game} value={game}>
                          {game}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No options available</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField select size="small" label="Select Expansion" value={selectedExpansion} onChange={(e) => setSelectedExpansion(e.target.value)} fullWidth>
                    {expansions && expansions.length > 0 ? (
                      expansions.map((exp) => (
                        <MenuItem key={exp} value={exp}>
                          {exp}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No options available</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    select
                    size="small"
                    label="Select Rarity"
                    value={selectedRarity}
                    onChange={(e) => {
                      setSelectedRarity(e.target.value)
                    }}
                    fullWidth
                  >
                    {rarityList && rarityList.length > 0 ? (
                      rarityList.map((rarity) => (
                        <MenuItem key={rarity} value={rarity}>
                          {rarity}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No options available</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField variant="outlined" size="small" placeholder="Search UID or card..." value={searchVal} onChange={handleSearchChange} fullWidth />
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedGame('')
                    setSelectedExpansion('')
                    setSearchVal('')
                    setSelectedRarity('')
                    setPaginationModel({ page: 0, pageSize: 10 })
                    refetch()
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </>
          )}

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
            checkboxSelection
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection as number[])
            }}
          />
        </Stack>
      </RenderContent>

      {/* Edit Modal */}
      {isEditOpen && selectedCard && <EditCardModal onClose={() => setIsEditOpen(false)} selectedCard={selectedCard} refetch={refetch} />}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Selected Cards"
        message={`Are you sure you want to delete ${selectedRows.length} card(s)? This action cannot be undone.`}
      />
    </>
  )
}

CardList.layoutProps = {
  title: 'Admin | Card List',
  pageType: 'protected',
  roles: 'superAdmin',
}

export default CardList
