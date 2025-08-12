import React, { useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Stack, Typography, TextField } from '@mui/material'

type ColorFields = {
  headerColor: string
  headerTextColor: string
  sidebarColor: string
  headerTextColor1: string
  sidebarButtonColorStatic: string
  sidebarButtonColorHover: string
  sidebarButtonTextColorStatic: string
  sidebarButtonTextColorHover: string
  sidebarButtonBorderColorStatic: string
  sidebarButtonBorderColorHover: string
}

const items = [
  'Header Color',
  'Header Text Color',
  'Sidebar Color',
  'Header Text Color',
  'Sidebar Button Color Static',
  'Sidebar Button Color Hover/Active',
  'Sidebar Button Text Color Static',
  'Sidebar Button Text Color Hover/Active',
  'Sidebar Button Border Color Static',
  'Sidebar Button Border Color Hover/Active',
]

const ColorField: React.FC = () => {
  const [colors, setColors] = useState<ColorFields>({
    headerColor: '#ffffff',
    headerTextColor: '#000000',
    sidebarColor: '#ffffff',
    headerTextColor1: '#000000',
    sidebarButtonColorStatic: '#ffffff',
    sidebarButtonColorHover: '#0000ff',
    sidebarButtonTextColorStatic: '#000000',
    sidebarButtonTextColorHover: '#ffffff',
    sidebarButtonBorderColorStatic: '#ffffff',
    sidebarButtonBorderColorHover: '#000000',
  })

  const handleColorChange = (key: keyof ColorFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setColors({ ...colors, [key]: event.target.value })
  }

  return (
    <Stack>
      <Grid container>
        {items.map((item, index) => (
          <Grid size={{ xs: 6 }} key={index}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>{item}</Typography>
              <TextField
                type="color"
                value={colors[Object.keys(colors)[index] as keyof ColorFields]}
                onChange={handleColorChange(Object.keys(colors)[index] as keyof ColorFields)}
                sx={{
                  width: 60,
                  padding: 0,
                  border: 'none',
                  bgcolor: 'transparent',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:focus .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default ColorField
