import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { groupId } = req.query
  const { page = 1 } = req.query

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TCG_API_BASE_URL}/cards/${groupId}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TCG_API_TOKEN}`,
      },
    })

    res.status(200).json(response.data)
  } catch (error: any) {
    console.error('Proxy error:', error)
    res.status(error.response?.status || 500).json({
      message: error.message || 'Server error',
    })
  }
}
