export const formatLabel = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatCardLabel = (card: any): string => {
  const year = card.year || ''
  const game = card.game_title || ''
  const abbr = card.abbreviation || ''
  const expansionName = card.expansion?.includes(':') ? card.expansion.split(':')[0].trim() : card.expansion || ''
  const number = card.number?.split('/')?.[0] || ''
  const name = card.title || ''
  const rarity = card.rarity || ''

  return `${year} ${game} ${abbr}-${expansionName} ${number} ${name} ${rarity}`.trim()
}
