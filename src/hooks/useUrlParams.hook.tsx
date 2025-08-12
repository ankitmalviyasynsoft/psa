import { useRouter } from 'next/router'

type TUpdateUrlParamsProps = {
  key: string
  value: string | number | undefined
  options?: { shallow: boolean; scroll: boolean }
}

export const useUrlParams = () => {
  const router = useRouter()

  const setUrlParams = ({ key, value, options }: TUpdateUrlParamsProps) => {
    let newParam = {}

    if (!value) delete router.query[key]
    else newParam = { [key]: value }

    router.replace({ query: { ...router.query, ...newParam } }, undefined, { shallow: options?.shallow ?? true, scroll: options?.scroll ?? false })
  }

  return { setUrlParams }
}
