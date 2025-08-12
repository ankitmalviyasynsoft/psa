import React, { useState } from 'react'
import { Button, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Radio, RadioGroup, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import { FiTrash } from 'react-icons/fi'

import ModalDailog from '@/components/_ui/modalDailog/ModalDailog.component'
import { style } from './ThemeGuide'

const notify = () => toast('Here is your toast.')

function ThemeGuide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Stack sx={style.root}>
        <Stack component="section" sx={style.title}>
          <Typography variant="h4">Theme Style Guide</Typography>
        </Stack>

        <Stack sx={style.cardStyle}>
          <Stack>
            <Typography variant="h4" color="blue">
              Typography Style
            </Typography>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Typography variant="body1">Body 1</Typography>
            <Typography variant="body2">Body 2</Typography>
            <Typography variant="overline">Overline</Typography>
            <Typography variant="subtitle1">Subtitle 1</Typography>
            <Typography variant="subtitle2">Subtitle 2</Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack>
            <Typography variant="h4" mb={3} color="blue">
              Button Style
            </Typography>
            <Stack direction="row" gap={3} flexWrap="wrap">
              <Button variant="contained" color="primary">
                Contained Primary
              </Button>
              <Button variant="contained" color="success">
                Contained Success
              </Button>
              <Button variant="contained" color="info">
                Contained Info
              </Button>
              <Button variant="contained" color="warning">
                Contained Warning
              </Button>
              <Button variant="contained" color="error">
                Contained Error
              </Button>
            </Stack>

            <Stack mt={2} direction="row" gap={3} flexWrap="wrap">
              <Button variant="outlined" color="primary">
                Contained Primary
              </Button>
              <Button variant="outlined" color="success">
                Contained Success
              </Button>
              <Button variant="outlined" color="info">
                Contained Info
              </Button>
              <Button variant="outlined" color="warning">
                Contained Warning
              </Button>
              <Button variant="outlined" color="error">
                Contained Error
              </Button>
            </Stack>

            <Stack mt={2} direction="row" gap={3} flexWrap="wrap">
              <Button variant="text">Text Button</Button>
              <Tooltip title="Delete">
                <IconButton aria-label="delete">
                  <FiTrash />
                </IconButton>
              </Tooltip>
              <Button variant="gradient" onClick={notify}>
                Make me a toast
              </Button>
              <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Open Modal Dialog
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack>
            <Typography variant="h4" mb={3} color="blue">
              Form Input's Style
            </Typography>

            <Stack gap={3}>
              <TextField placeholder="Text Field" />
              <TextField type="password" placeholder="Password" />

              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                  <FormControlLabel value="disabled" disabled control={<Radio />} label="other" />
                </RadioGroup>
              </FormControl>

              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                <FormControlLabel required control={<Checkbox />} label="Required" />
                <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
              </FormGroup>

              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Label" />
              </FormGroup>

              <Stack direction="row" gap={3} flexWrap="wrap">
                <Chip label="Chip Filled" color="primary" />
                <Chip label="Chip Outlined" color="primary" variant="outlined" />

                <Chip label="Chip Filled" color="success" />
                <Chip label="Chip Outlined" color="success" variant="outlined" />

                <Chip label="Chip Filled" color="info" />
                <Chip label="Chip Outlined" color="info" variant="outlined" />

                <Chip label="Chip Filled" color="warning" />
                <Chip label="Chip Outlined" color="warning" variant="outlined" />

                <Chip label="Chip Filled" color="error" />
                <Chip label="Chip Outlined" color="error" variant="outlined" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <ModalDailog openModal={open} closeModal={setOpen} />
      <Toaster />
    </>
  )
}

export default ThemeGuide

ThemeGuide.layoutProps = {
  title: 'ThemeGuide',
  pageType: 'protected',
}
