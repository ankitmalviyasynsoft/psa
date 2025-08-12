import axios from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

const headersMap = {
  expansionName: 'Expansion',
  gameName: 'Game',
  name: 'Name',
  number: 'Number',
  productId: 'TCGPlayer_ID',
  rarity: 'Rarity',
  abbreviation: 'Abbreviation',
  year: 'Year',
  image: 'Image_link',
}

const fetchAllCardsByGroupId = async (groupId: number) => {
  let currentPage = 1
  let hasNextPage = true
  const allCards: any[] = []

  while (hasNextPage) {
    const res = await axios.get(`/api/cards/${groupId}?page=${currentPage}`)
    const data = res.data?.data
    if (!data?.cards?.length) break

    allCards.push(...data.cards)
    hasNextPage = data.pagination?.hasNextPage
    currentPage++
  }

  return allCards
}

const generateCSV = (cards: any[]) => {
  const keys = Object.keys(headersMap)
  const headerLabels = Object.values(headersMap)
  const rows = cards.map((card) =>
    keys
      .map((key) => {
        const val = key === 'year' ? '2025' : key === 'abbreviation' ? 'JTG EN' : (card[key] ?? '')
        return `"${val.toString().replace(/"/g, '""')}"`
      })
      .join(','),
  )
  return [headerLabels.join(','), ...rows].join('\n')
}

export const downloadCardsAsZIP = async (expansions: { groupId: number; name: string }[]) => {
  try {
    const zip = new JSZip()

    for (const expansion of expansions) {
      const cards = await fetchAllCardsByGroupId(expansion.groupId)
      const csv = generateCSV(cards)
      zip.file(`${expansion.name.replace(/[^a-z0-9]/gi, '_')}.csv`, csv)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'all_cards.zip')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'ZIP download failed')
    console.error('ZIP generation failed:', err)
  }
}
