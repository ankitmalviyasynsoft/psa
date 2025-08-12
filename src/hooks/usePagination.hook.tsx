import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const usePagination = (size = 10) => {
  type TPaginationModel = { page: number; pageSize: number }

  const router = useRouter()
  const { page, pageSize }: TPaginationModel = { page: +(router.query.page || 1), pageSize: +(router.query.pageSize || size) }
  const paginationModel = { page: page - 1, pageSize }

  useEffect(() => {
    if (!router.query.page || !router.query.pageSize) setPaginationModel({ page: page - 1, pageSize })
  })

  const setPaginationModel = ({ page, pageSize, hash }: TPaginationModel & { hash?: string }) => {
    router.replace({ query: { ...router.query, page: page + 1, pageSize }, hash }, undefined, { shallow: true, scroll: true })
  }

  return { paginationModel, setPaginationModel, page, pageSize, limit: pageSize }
}
