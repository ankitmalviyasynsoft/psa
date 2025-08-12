import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'

import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, Box, Button } from '@mui/material'

interface CardInformationProps {
  openModal: boolean
  onClose: () => void
  data: any
}

const CardInformation: React.FC<CardInformationProps> = ({ openModal, onClose, data }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    if (data) {
      const frontImage = data.image_link?.find((img: any) => img.IsFrontImage)?.ImageURL
      setActiveImage(frontImage || null)
    }
  }, [data])
  if (!data) return null

  const frontImage = data.image_link?.find((img: any) => img.IsFrontImage)?.ImageURL
  const backImage = data.image_link?.find((img: any) => !img.IsFrontImage)?.ImageURL

  const infoMap = [
    { label: 'Cert Number', value: data.cert_number },
    { label: 'Item Grade', value: data.PSACert?.CardGrade },
    { label: 'Label Type', value: data.PSACert?.LabelType },
    { label: 'Reverse Cert/Barcode', value: data.PSACert?.ReverseBarCode ? 'YES' : 'NO' },
    { label: 'Year', value: data.PSACert?.Year },
    { label: 'Brand/Title', value: data.PSACert?.Brand },
    { label: 'Subject', value: data.PSACert?.Subject },
    { label: 'Card Number', value: data.PSACert?.CardNumber },
    { label: 'Category', value: data.PSACert?.Category },
    { label: 'Variety/Pedigree', value: data.PSACert?.Variety },
  ]

  return (
    <Dialog open={openModal} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Card Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          {/* Left: Images */}
          <Grid size={{ xs: 12, md: 1 }}>
            {/* Thumbnail column */}
            <Box display="flex" flexDirection="column" gap={1}>
              {frontImage && (
                <img
                  src={frontImage}
                  alt="Front"
                  onClick={() => setActiveImage(frontImage)}
                  style={{
                    width: 70,
                    border: activeImage === frontImage ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                />
              )}
              {backImage && (
                <img
                  src={backImage}
                  alt="Back"
                  onClick={() => setActiveImage(backImage)}
                  style={{
                    width: 70,
                    border: activeImage === backImage ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              {/* Main Image */}
              {activeImage && (
                <Box mt={2}>
                  <img
                    src={activeImage}
                    alt="Selected"
                    style={{
                      width: 250,
                      borderRadius: 8,
                      border: '1px solid #ddd',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right: Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Item Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box>
              {infoMap.map(({ label, value }) => (
                <Box key={label} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {value || 'N/A'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CardInformation
