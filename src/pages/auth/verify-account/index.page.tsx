import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import WebsiteLoader from '@/components/_ui/websiteLoader/WebsiteLoader.component'
import { Page } from '@/types/page.type'
import { useVerifyAccountMutation } from '@/redux/api/auth.api'

const VerifyAccount: Page = () => {
  const router = useRouter()
  const { token } = router.query
  const [loading, setLoading] = useState(true)
  const [verifyAccount] = useVerifyAccountMutation()

  useEffect(() => {
    const verify = async () => {
      if (router.isReady && token) {
        const tokenString = Array.isArray(token) ? token[0] : token
        try {
          const result = await verifyAccount({ token: tokenString }).unwrap()
          if (result.statusCode === 200) {
            router.push('/auth/login')
          } else {
            router.push('/auth/sign-up')
          }
        } catch (error) {
          console.log('error', error)

          router.push('/auth/sign-up')
        } finally {
          setLoading(false)
        }
      }
    }
    verify()
  }, [router.isReady, token, verifyAccount])

  if (loading) {
    return <WebsiteLoader />
  }

  return null
}

export default VerifyAccount

VerifyAccount.layoutProps = {
  title: 'Verify Account',
  header: false,
  sidebar: false,
  footer: false,
  pageType: 'public',
}
