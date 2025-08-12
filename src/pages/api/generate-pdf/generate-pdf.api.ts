import type { NextApiRequest, NextApiResponse } from 'next'
import { launchPuppeteer } from '@/lib/puppeteerLauncher'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    let { html } = req.body

    console.log('=========================>>', html)

    if (!html || typeof html !== 'string') {
      return res.status(400).json({ error: 'HTML content is required' })
    }

    const browser = await launchPuppeteer()
    const page = await browser.newPage()
    html = html.replace('\r\n', '')
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"')
    res.setHeader('Content-Length', pdfBuffer.length.toString())

    res.end(pdfBuffer) // IMPORTANT: binary safe
  } catch (err) {
    console.error('PDF generation error:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
}
