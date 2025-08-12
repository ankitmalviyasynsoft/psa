import { toast } from 'react-toastify'

export const handleCopy = (text: string) => {
  if (navigator.clipboard && window.ClipboardEvent) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Link copied')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
        fallbackCopy(text)
      })
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy(text: string) {
  const tempTextArea = document.createElement('textarea')
  tempTextArea.value = text
  document.body.appendChild(tempTextArea)
  tempTextArea.select()
  tempTextArea.setSelectionRange(0, 99999) // For mobile devices
  try {
    document.execCommand('copy')
    toast.success('Link copied')
  } catch (err) {
    console.error('Failed to copy (fallback): ', err)
  } finally {
    document.body.removeChild(tempTextArea)
  }
}
