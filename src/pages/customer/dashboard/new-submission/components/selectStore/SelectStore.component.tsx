import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import RenderContent from '@/components/renderContent/RenderContent.component'
import { setStoreData } from '@/redux/slice/selectedStore'
import { useGetStoreListQuery } from '@/redux/api/store.api'
import { useReduxDispatch } from '@/hooks'

interface SelectStoreProps {
  onClose: () => void
}

export const SelectStore: React.FC<SelectStoreProps> = ({ onClose }) => {
  const router = useRouter()
  const dispatch = useReduxDispatch()
  const [page, setPage] = useState(1)
  const { data: getStoreList, isLoading, isError } = useGetStoreListQuery({ page, limit: 10 })

  const totalStores: number = getStoreList?.totalItems || 0
  const stores: Array<any> = getStoreList?.result || []

  const [visibleStores, setVisibleStores] = useState<any[]>([])

  useEffect(() => {
    setVisibleStores([])
    setPage(1)
  }, [])

  useEffect(() => {
    if (!getStoreList) return

    if (page === 1) {
      setVisibleStores(stores)
    } else {
      setVisibleStores((prev) => [...prev, ...stores])
    }
  }, [getStoreList, page])

  const handleRowClick = (store: any) => {
    dispatch(setStoreData(store))
    localStorage.setItem('selectedStore', JSON.stringify(store))
    router.push(`/customer/dashboard/new-submission/${store.slug}`)
  }

  const handleLoadMore = () => {
    if (visibleStores.length < totalStores) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Store</DialogTitle>
      <DialogContent>
        <RenderContent loading={isLoading} error={isError}>
          {visibleStores.length === 0 ? (
            <Typography variant="body1" color="textSecondary" align="center">
              No store found
            </Typography>
          ) : (
            <List>
              {visibleStores.map((store) => (
                <ListItem component="li" key={store.id} onClick={() => handleRowClick(store)} sx={{ cursor: 'pointer' }}>
                  <ListItemText primary={store.name} />
                </ListItem>
              ))}
            </List>
          )}
          {visibleStores.length < totalStores && (
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ marginTop: 2 }}>
              <Button variant="contained" size="small" onClick={handleLoadMore}>
                Load More
              </Button>
            </Stack>
          )}
        </RenderContent>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelectStore
