import React, { useState, useRef } from 'react'
import { Box } from '@mui/material'
import { createPortal } from 'react-dom'

type ImagePreviewProps = {
  src: string
  alt?: string
  thumbSize?: number
  previewSize?: number
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = 'preview-image', thumbSize = 40, previewSize = 200 }) => {
  const [showPreview, setShowPreview] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const imgRef = useRef<HTMLImageElement>(null)

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.right + 10 + window.scrollX,
      })
      setShowPreview(true)
    }
  }

  const handleMouseLeave = () => {
    setShowPreview(false)
  }

  return (
    <>
      <Box
        component="img"
        ref={imgRef}
        src={src}
        alt={alt}
        sx={{
          width: thumbSize,
          height: thumbSize,
          objectFit: 'cover',
          borderRadius: 1,
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {showPreview &&
        createPortal(
          <Box
            onMouseLeave={handleMouseLeave}
            sx={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              zIndex: 1300,
              bgcolor: 'background.paper',
              border: '1px solid #ccc',
              borderRadius: 1,
              boxShadow: 3,
              p: 0.5,
            }}
          >
            <Box
              component="img"
              src={src}
              alt={`${alt}-preview`}
              sx={{
                width: previewSize,
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          </Box>,
          document.body,
        )}
    </>
  )
}

export default ImagePreview
