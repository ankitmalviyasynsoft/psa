import React, { useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Autocomplete, CircularProgress, Stack, TextField, Typography, Button, Checkbox } from '@mui/material'
import { FaRegSquare, FaCheckSquare } from 'react-icons/fa'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import { Page } from '@/types/page.type'
import { style } from './exportCSV.style'
import { useImportCSVData } from './useImportCSVData'
import { downloadCardsAsZIP } from '@/utils/downloadCardsAsCSV'

interface Expansion {
  groupId: number
  name: string
  abbreviation: string
  categoryId: number
}

const ExportCSV: Page = () => {
  const { games, expansions, selectedGame, setSelectedGame, selectedExpansions, setSelectedExpansions, handleScroll, isFetching, isExpansionsLoading } = useImportCSVData()
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <Stack spacing={2} p={2}>
      <PageHeader title="Export CSV" />
      <Stack sx={style.cardStyle} gap={2}>
        <Typography variant="h6">Download CSV</Typography>
        <Typography variant="body2" color="textSecondary">
          Download the CSV template to import your data. Ensure the file is formatted correctly.
        </Typography>

        <Grid container spacing={2}>
          {/* Game Autocomplete */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Autocomplete
              options={games.slice().sort((a, b) => a.name.localeCompare(b.name))}
              getOptionLabel={(option) => option.name}
              value={selectedGame}
              onChange={(_, newValue) => setSelectedGame(newValue)}
              loading={isFetching}
              fullWidth
              isOptionEqualToValue={(option, value) => option.categoryId === value?.categoryId}
              onOpen={() => {}}
              ListboxProps={{
                onScroll: (event) => handleScroll(event, 'game'),
                style: { maxHeight: 300 },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Game"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isFetching ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Expansion Autocomplete */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={expansions.slice().sort((a, b) => a.name.localeCompare(b.name))}
              getOptionLabel={(option) => option.name}
              value={selectedExpansions}
              onChange={(_, newValue) => setSelectedExpansions(newValue)}
              loading={isExpansionsLoading}
              fullWidth
              disabled={!selectedGame || isExpansionsLoading}
              isOptionEqualToValue={(option, value) => option.groupId === value?.groupId}
              ListboxProps={{
                onScroll: (event) => handleScroll(event, 'expansion'),
                style: { maxHeight: 300 },
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selected ? <FaCheckSquare size={16} /> : <FaRegSquare size={16} />}
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Expansions"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isExpansionsLoading ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Download Button */}
          <Grid size={{ xs: 12 }} paddingTop={2}>
            <Stack direction="row" justifyContent="center">
              <Button
                variant="contained"
                disabled={selectedExpansions.length === 0 || isDownloading}
                onClick={async () => {
                  setIsDownloading(true)
                  try {
                    await downloadCardsAsZIP(selectedExpansions)
                  } finally {
                    setIsDownloading(false)
                  }
                }}
                startIcon={isDownloading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isDownloading ? 'Generating CSVs...' : 'Get Data'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}

ExportCSV.layoutProps = {
  title: 'Export CSV',
  pageType: 'protected',
  roles: 'superAdmin',
}

export default ExportCSV
