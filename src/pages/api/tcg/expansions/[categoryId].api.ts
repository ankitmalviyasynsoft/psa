import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { categoryId, page } = req.query

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TCG_API_BASE_URL}/expansions/${categoryId}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TCG_API_TOKEN}`,
      },
    })

    res.status(200).json(response.data)
  } catch (error: any) {
    console.error('Expansions API error:', error)
    res.status(error.response?.status || 500).json({ message: error.message })
  }
}
