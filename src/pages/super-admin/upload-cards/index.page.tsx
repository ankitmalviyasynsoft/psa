import React, { useState } from 'react'
import Papa from 'papaparse'
import Grid from '@mui/material/Grid2'
import { Box, Typography, Stack, Button, Paper, IconButton } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { MdOutlineDeleteOutline } from 'react-icons/md'

import PageHeader from '@/components/_ui/pageHeader/PageHeader.component'
import { style } from './UploadCards.style'
import { schema, TSchema } from './UploadCards.config'
import { useUploadCSVFileMutation } from '@/redux/api/card.api'
import { Page } from '@/types/page.type'
import { CSVPreview } from './components/CSVPreview.component'

const UploadCards: Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [uploadCSVFile] = useUploadCSVFileMutation()

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TSchema>({
    resolver: yupResolver(schema),
  })

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFileSelection(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelection(file)
  }

  const handleFileSelection = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (file.type !== 'text/csv' && extension !== 'csv') {
      toast.error('Only CSV files are allowed.')
      return
    }

    setSelectedFile(file)

    Papa.parse(file, {
      complete: (results: any) => {
        const data = results.data as string[][]
        setCsvPreview(data)
      },
      error: (err: any) => {
        toast.error('Failed to parse CSV file.')
        console.error(err)
      },
    })
  }

  const deleteFile = async () => {
    setSelectedFile(null)
  }

  const onSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    const response = await uploadCSVFile(formData).unwrap()

    setSelectedFile(null)
    setCsvPreview([])
    setIsPreviewOpen(false)
  }

  return (
    <Stack spacing={2} p={2}>
      <PageHeader title="Upload Cards" />
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>
        {!selectedFile && (
          <Paper elevation={3} sx={style.paperStyle} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <IoCloudUploadOutline style={{ fontSize: 50 }} />
            <Typography variant="h6" mt={2}>
              Drag & Drop files here
            </Typography>
            <Typography mt={1} mb={2} color="text.secondary">
              or
            </Typography>

            <input
              id="file-input"
              type="file"
              accept=".csv,text/csv"
              hidden
              {...register('file')}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setValue('file', file)
                  handleFileSelection(file)
                }
              }}
            />

            <label htmlFor="file-input">
              <Button variant="outlined" component="span">
                Browse Files
              </Button>
            </label>
            <Typography variant="h6" mt={2}>
              Support Only CSV File
            </Typography>
          </Paper>
        )}
        {errors.file && (
          <Typography color="error" variant="body2">
            {errors.file.message}
          </Typography>
        )}

        {selectedFile && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1">Selected File:</Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsPreviewOpen(true)}>
                {selectedFile.name} (Click to preview)
              </Typography>
              <IconButton onClick={deleteFile} color="error">
                <MdOutlineDeleteOutline />
              </IconButton>
            </Box>
          </Paper>
        )}

        <CSVPreview open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} data={csvPreview} />

        <Grid container justifyContent="center" alignItems="center" mt={3}>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Upload
          </LoadingButton>
        </Grid>
      </Stack>
    </Stack>
  )
}

export default UploadCards

UploadCards.layoutProps = {
  title: 'Upload Cards',
  pageType: 'protected',
  roles: 'superAdmin',
}
