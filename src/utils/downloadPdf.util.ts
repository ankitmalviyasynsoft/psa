import { getCookie } from '@/utils/cookie.util'

export const downloadFile = async (url: string): Promise<string> => {
  const token = getCookie('token')

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download HTML. Status: ${response.status}`)
  }

  const html = await response.text()
  return JSON.parse(html) // raw HTML string
}
