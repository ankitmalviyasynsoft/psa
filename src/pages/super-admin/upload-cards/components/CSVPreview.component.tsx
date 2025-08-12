import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { IoMdCloseCircleOutline } from 'react-icons/io'

interface CSVPreviewProps {
  open: boolean
  onClose: () => void
  data: string[][]
}

export const CSVPreview: React.FC<CSVPreviewProps> = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        CSV Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoMdCloseCircleOutline />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 500, overflow: 'auto' }}>
        {data.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                {data[0].map((header, idx) => (
                  <TableCell key={idx}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(1).map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <TableCell key={cellIdx}>
                      {cellIdx === row.length - 1 ? (
                        <a href={cell} target="_blank" rel="noopener noreferrer" style={{ color: '#1e88e5', textDecoration: 'underline', cursor: 'pointer' }}>
                          {cell}
                        </a>
                      ) : (
                        cell
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No data to preview.</Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}
