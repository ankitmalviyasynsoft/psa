import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { paths } from '@/path'
import { LayoutProps } from './Layout.type'
import { getCookie } from '@/utils/cookie.util'
import { useLazyGetUserQuery } from '@/redux/api/user.api'
import { useReduxDispatch, useReduxSelector } from '@/hooks'
import { handleWebsiteLoader } from '@/redux/slice/auth.slice'

export const useAuth = ({ pageType, roles }: LayoutProps) => {
  const router = useRouter()
  const token = getCookie('token')
  const dispatch = useReduxDispatch()
  const [getUser] = useLazyGetUserQuery()
  const { isLoggedIn, role } = useReduxSelector((state) => state.profile)

  const [loading, setLoading] = useState(pageType === 'public' ? false : true)
  const [permission, setPermission] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    dispatch(handleWebsiteLoader(loading))
  }, [loading])

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        if (pageType === 'protected') {
          await router.replace(`/auth/login?returnTo=${location.pathname}${location.search}${location.hash}`)
        } else {
          setLoading(false)
        }
        return
      }

      try {
        await getUser().unwrap()
      } catch {
        setError(true)
        setLoading(false)
        return
      }

      if (pageType === 'auth' && isLoggedIn) {
        const valid = await checkUser()
        if (valid) await router.replace('/')
        return
      }

      if (pageType === 'protected' && isLoggedIn) {
        const valid = await checkUser()
        if (valid && roles?.length) {
          const hasPermission = roles.includes(role)
          setPermission(hasPermission)
        }
        setLoading(false)
      }
    }

    initializeAuth()
  }, [router.pathname, isLoggedIn])

  const checkUser = async () => {
    if (role === 'customer') {
      if (pageType !== 'auth' && !paths.customerPaths.some((path) => router.pathname.startsWith(path))) {
        await router.push('/customer/dashboard')
        setLoading(false)
        return false
      }
    }

    if (role === 'admin') {
      if (pageType !== 'auth' && !paths.adminPaths.some((path) => router.pathname.startsWith(path))) {
        await router.push('/admin/settings')
        setLoading(false)
        return false
      }
    }

    if (role === 'superAdmin') {
      if (pageType !== 'auth' && !paths.superAdminPaths.some((path) => router.pathname.startsWith(path))) {
        await router.push('/super-admin/dashboard')
        setLoading(false)
        return false
      }
    }
    return true
  }

  return {
    isLoading: loading,
    isPermission: permission,
    isError: error,
  }
}
