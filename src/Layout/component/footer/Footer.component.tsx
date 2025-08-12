import { Box, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        &copy;{new Date().getFullYear()} PSA Cards. All right reserved
      </Typography>
    </Box>
  )
}
