import { useEffect, useState } from 'react'
import { useGetGameListFromTCGQuery, useLazyGetExpansionsByCategoryIdQuery } from '@/redux/api/tcg.api'

interface Game {
  name: string
  categoryId: number
}

interface Expansion {
  groupId: number
  name: string
  abbreviation: string
  categoryId: number
}

export const useImportCSVData = () => {
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedExpansions, setSelectedExpansions] = useState<Expansion[]>([])

  const [gamePage, setGamePage] = useState(1)
  const [expansionPage, setExpansionPage] = useState(1)
  const [expansions, setExpansions] = useState<Expansion[]>([])

  const { data: gameData, isFetching: isFetchingGames } = useGetGameListFromTCGQuery(gamePage)

  const categoryId = selectedGame?.categoryId
  const [fetchExpansions, { data: expansionData, isLoading: isExpansionsLoading, isFetching: isFetchingExpansions }] = useLazyGetExpansionsByCategoryIdQuery()

  useEffect(() => {
    if (gameData?.games?.length) {
      setGames((prev) => {
        const existingIds = new Set(prev.map((g) => g.categoryId))
        const newGames = gameData.games.filter((g) => !existingIds.has(g.categoryId))
        return [...prev, ...newGames]
      })
    }
  }, [gameData])

  useEffect(() => {
    if (expansionData?.expansions?.length) {
      setExpansions((prev) => {
        const existingIds = new Set(prev.map((e) => e.groupId))
        const newExps = expansionData.expansions.filter((e) => !existingIds.has(e.groupId))
        return [...prev, ...newExps]
      })
    }
  }, [expansionData])

  useEffect(() => {
    if (!selectedGame) return

    setSelectedExpansions([])
    setExpansionPage(1)

    fetchExpansions({ categoryId: selectedGame.categoryId, page: 1 })
  }, [selectedGame])

  const handleScroll = (event: React.UIEvent<HTMLUListElement>, type: 'game' | 'expansion') => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isBottom = scrollHeight - scrollTop <= clientHeight + 50

    if (type === 'game' && isBottom && gameData?.pagination?.hasNextPage && !isFetchingGames) {
      setGamePage((prev) => prev + 1)
    }

    if (type === 'expansion' && isBottom && expansionData?.pagination?.hasNextPage && !isFetchingExpansions) {
      const nextPage = expansionPage + 1
      setExpansionPage(nextPage)
      fetchExpansions({ categoryId: selectedGame!.categoryId, page: nextPage })
    }
  }

  return {
    games,
    expansions,
    selectedGame,
    setSelectedGame,
    selectedExpansions,
    setSelectedExpansions,
    handleScroll,
    isFetching: isFetchingGames,
    isExpansionsLoading,
  }
}
