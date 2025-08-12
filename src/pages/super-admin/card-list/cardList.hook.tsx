import { GridColDef } from '@mui/x-data-grid'
import { Stack } from '@mui/material'
import { MdEdit } from 'react-icons/md'

import ImagePreview from '@/components/imagePreview/ImagePreview.component'
import { CardDTO } from '@/dto/Card.dto'

interface UseCardListColumnsProps {
  onEditClick: (card: CardDTO) => void
}

export const useCardListColumns = ({ onEditClick }: UseCardListColumnsProps): GridColDef[] => {
  return [
    {
      field: 'image_link',
      headerName: 'Image',
      flex: 1,
      sortable: false,
      renderCell: (params) => <ImagePreview src={params.value} alt={`card-${params.row.uid}`} />,
    },
    { field: 'uid', headerName: 'UID', flex: 1, sortable: false },
    { field: 'title', headerName: 'Card Name', flex: 1, sortable: false },
    { field: 'game_title', headerName: 'Game Name', flex: 1, sortable: false },
    { field: 'expansion', headerName: 'Expansion', flex: 1, sortable: false },
    { field: 'rarity', headerName: 'Rarity', flex: 1, sortable: false },
    { field: 'number', headerName: 'Number', flex: 1, sortable: false },
    { field: 'year', headerName: 'Year', flex: 1, sortable: false },
    { field: 'abbreviation', headerName: 'Abbreviation', flex: 1, sortable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" sx={{ height: '100%', cursor: 'pointer' }}>
          <MdEdit
            size={20}
            onClick={() => {
              onEditClick(params.row)
            }}
          />
        </Stack>
      ),
    },
  ]
}
